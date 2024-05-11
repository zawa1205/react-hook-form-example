import styles from "./page.module.css";
import { Form } from "@/components/Form";

const defaultValues = {
  cart: [{ name: "test", quantity: 1, price: 23 }],
};

export default function Home() {
  return (
    <main className={styles.main}>
      <Form defaultValues={defaultValues} />
    </main>
  );
}
