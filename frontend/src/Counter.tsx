import React from "react";

export default function Counter() {
  const [count, setCount] = React.useState(0);

  // interface Product {
  //   id: number;
  //   name: string;
  //   price: number;
  // }
  // function calculateTotalPrice(products: Product[]): number {
  //   return products.reduce((total, product) => total + product.price, 0);
  // }
  // const products: Product[] = [
  //   { id: 1, name: "Product 1", price: 10 },
  //   { id: 2, name: "Product 2", price: 20 },
  //   { id: 3, name: "Product 3", price: 30 },
  // ];
  // const totalPrice = calculateTotalPrice(products);
  // console.log("totalPrice", totalPrice);

  // function flattenArray(arr) {
  //   return arr.reduce((flat, toFlatten) => {
  //     return flat.concat(Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten);
  //   }, []);
  // }

  // const nestedArray = [1, [2, [3, 4], 5], 6];
  // console.log("flattenArray(nestesArray", flattenArray(nestedArray));
  //____________________
  interface Product {
    id: number;
    name: string;
    attributes: {
      categoryId: number;
      categoryName: string;
      price: number;
    };
  }
  interface NewProduct {
    id: number;
    name: string;
    price: number;
  }

  interface Category {
    name: string;
    Products: NewProduct[];
  }

  const Products: Product[] = [
    {
      id: 1,
      name: "product1",
      attributes: { categoryId: 1, categoryName: "category1", price: 10 },
    },
    {
      id: 2,
      name: "product2",
      attributes: { categoryId: 2, categoryName: "category2", price: 15 },
    },
    {
      id: 3,
      name: "product3",
      attributes: { categoryId: 1, categoryName: "category1", price: 10 },
    },
  ];
  // note: example of required structure
  // const categoriesDictionary = {"1": {"name": "category1", "Products": [{"id": 1, "name": "product1", "price": 10}, ]}};

  const categoriesDictionary: Record<string, Category> = {};
  Products.forEach((productItem) => {
    const idNumber = String(productItem.id);
    const categoryName = productItem.attributes.categoryName;
    console.log("categoryName", categoryName);
    if (!categoriesDictionary[idNumber]) {
      categoriesDictionary[idNumber] = {
        name: categoryName,
        Products: [],
      };
    }

    // Push product details to the corresponding category
    categoriesDictionary[idNumber].Products.push({
      id: productItem.id,
      name: productItem.name,
      price: productItem.attributes.price,
    });
  });

  console.log(categoriesDictionary);
  //***______________________________________ */
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
