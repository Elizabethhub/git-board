import React from "react";

export default function Counter() {
  const [count, setCount] = React.useState(0);

  interface Product {
    id: number;
    name: string;
    price: number;
  }
  function calculateTotalPrice(products: Product[]): number {
    return products.reduce((total, product) => total + product.price, 0);
  }
  const products: Product[] = [
    { id: 1, name: "Product 1", price: 10 },
    { id: 2, name: "Product 2", price: 20 },
    { id: 3, name: "Product 3", price: 30 },
  ];
  const totalPrice = calculateTotalPrice(products);
  console.log("totalPrice", totalPrice);

  function flattenArray(arr) {
    return arr.reduce((flat, toFlatten) => {
      return flat.concat(Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten);
    }, []);
  }

  const nestedArray = [1, [2, [3, 4], 5], 6];
  console.log("flattenArray(nestesArray", flattenArray(nestedArray));
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
