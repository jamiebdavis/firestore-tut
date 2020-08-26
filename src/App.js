import "./App.css";

import React, { useEffect, useState } from "react";

import firebase from "./firebase";
import { useForm } from "react-hook-form";

function App() {
    const [cafes, setCafes] = useState([]);
    const [db, setDb] = useState(firebase.firestore());

    const { register, handleSubmit, watch, errors, reset } = useForm();

    useEffect(() => {
        // const db = firebase.firestore();
        // const data = await db.collection("cafes").where("city", "==", "Manchester").orderBy("name").get();
        // const data = await db.collection("cafes").orderBy("name").get();

        // Returns the result of on snapshot call
        return db
            .collection("cafes")
            .orderBy("name")
            .onSnapshot(snapshot => {
                // let changes = snapshot.docChanges();
                let changes = [];

                snapshot.forEach(doc => changes.push({ ...doc.data(), id: doc.id }));
                setCafes(changes);
            });
    }, []);

    const onSubmit = async data => {
        const res = await db.collection("cafes").add({
            name: data.name,
            city: data.city,
        });

        console.log("Added document with ID: ", res.id);

        reset();
    };

    const handleDelete = async id => {
        const res = await db.collection("cafes").doc(id).delete();
        console.log(id, " deleted");
    };

    return (
        <div>
            <h1>Cloud Cafe</h1>

            <div className="content">
                {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* register your input into the hook by invoking the "register" function */}
                    <input name="name" placeholder="name" ref={register} />

                    {/* include validation with required or other standard HTML validation rules */}
                    <input name="city" placeholder="city" ref={register} />

                    <input type="submit" />
                </form>

                <ul id="cafe-list">
                    {cafes.map(doc => {
                        return (
                            <li key={doc.id}>
                                <span>{doc.name}</span>
                                <span>{doc.city}</span>
                                <div onClick={() => handleDelete(doc.id)}>x</div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default App;
