import { useEffect, useState } from "react";

let pushToast = () => {};

export function toast(message, tone = "default") {
  pushToast({ message, tone, id: Date.now() });
}

export function ToastHost() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    pushToast = (item) => {
      setItems((prev) => [...prev, item]);
      setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== item.id));
      }, 3000);
    };
    return () => {
      pushToast = () => {};
    };
  }, []);

  if (items.length === 0) return null;
  return (
    <div aria-live="polite" className="fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4">
      {items.map((item) => (
        <p
          key={item.id}
          className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-plum-900 shadow-card"
        >
          {item.message}
        </p>
      ))}
    </div>
  );
}
