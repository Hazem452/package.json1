import { useState, useEffect, useMemo } from "react";

export default function Home() { 
  const [weight, setWeight] = useState(120); 
  const [goal] = useState(80);
  const [foods, setFoods] = useState([]); 
  const [foodName, setFoodName] = useState(""); 
  const [foodCalories, setFoodCalories] = useState(0);
  const [water, setWater] = useState(0); 
  const [fastingStart, setFastingStart] = useState(null);
  const [chat, setChat] = useState([ { role: "assistant", content: "أنا مدربك الذكي. اسألني أي حاجة." } ]);
  const [msg, setMsg] = useState("");

  const totalCalories = useMemo( () => foods.reduce((s, f) => s + f.calories, 0), [foods] );
  const fastingHours = useMemo(() => { if (!fastingStart) return 0; return (Date.now() - fastingStart) / 3600000; }, [fastingStart]);

  const addFood = () => { if (!foodName || !foodCalories) return; setFoods([...foods, { name: foodName, calories: Number(foodCalories) }]); setFoodName(""); setFoodCalories(0); };

  const sendMessage = async () => { 
    if (!msg) return;
    const userMsg = { role: "user", content: msg }; 
    setChat([...chat, userMsg]);
    const res = await fetch("/api/chat", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ message: msg, state: { weight, goal, calories: totalCalories, fastingHours, water } }) 
    }); 
    const data = await res.json(); 
    const aiMsg = { role: "assistant", content: data.reply }; 
    setChat(prev => [...prev, aiMsg]); 
    setMsg(""); 
  };

  return ( 
    <div style={{ padding: 20, maxWidth: 600, margin: "auto", fontFamily: "sans-serif" }}> 
      <h1>AI Fat Loss Coach</h1>
      <div style={{ border: "1px solid #ccc", padding: 10, height: 300, overflow: "auto", marginBottom: 10 }}> 
        {chat.map((c, i) => ( <div key={i} style={{ color: c.role === "assistant" ? "blue" : "black", marginBottom: 10 }}> <strong>{c.role === "assistant" ? "AI:" : "You:"}</strong> {c.content} </div> ))} 
      </div> 
      <input style={{ width: '80%' }} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="اسأل مدربك..." /> 
      <button onClick={sendMessage}>Send</button> 
      <hr /> 
      <h3>Food Log</h3> 
      <input placeholder="اسم الأكلة" value={foodName} onChange={(e) => setFoodName(e.target.value)} /> 
      <input type="number" placeholder="السعرات" value={foodCalories} onChange={(e) => setFoodCalories(e.target.value)} /> 
      <button onClick={addFood}>Add</button> 
      <p>Total Calories: {totalCalories}</p> 
      <hr /> 
      <h3>Fasting Tracker</h3> 
      <button onClick={() => setFastingStart(Date.now())}>Start Fasting</button> 
      <button onClick={() => setFastingStart(null)}>Stop</button> 
      <p>{fastingHours.toFixed(1)} hours fasted</p> 
    </div> 
  ); 
}
