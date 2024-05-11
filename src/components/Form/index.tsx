"use client";
import {
  useForm,
  useWatch,
  useFieldArray,
  Control,
  FieldArrayWithId,
  UseFormRegister,
  FieldErrors,
  UseFieldArrayMove,
} from "react-hook-form";
import style from "./style.module.css";
import { useState } from "react";

type FormValues = {
  cart: {
    name: string;
    price: number;
    quantity: number;
  }[];
};

const Total = ({ control }: { control: Control<FormValues> }) => {
  console.log("🍎" + control);
  const formValues = useWatch({
    name: "cart",
    control,
  });
  const total = formValues.reduce(
    (acc, current) => acc + (current.price || 0) * (current.quantity || 0),
    0
  );
  return <p>Total Amount: {total}</p>;
};

type RowProps = {
  field: FieldArrayWithId<FormValues, "cart", "id">;
  index: number;
  register: UseFormRegister<FormValues>;
  remove: (index?: number | number[] | undefined) => void;
  move: UseFieldArrayMove;
  errors: FieldErrors<FormValues>;
  maxLength: number;
};

const Row = ({
  field,
  index,
  register,
  remove,
  errors,
  maxLength,
  move,
}: RowProps) => {
  return (
    <div key={field.id}>
      <section className={"section"} key={field.id}>
        {index === 0 ? (
          <div className={style.spacer} />
        ) : (
          <button
            className={style.moveButton}
            onClick={() => move(index, index - 1)}
          >
            ↑
          </button>
        )}
        {index === maxLength ? (
          <div className={style.spacer} />
        ) : (
          <button
            className={style.moveButton}
            onClick={() => {
              move(index, index + 1);
            }}
          >
            ↓
          </button>
        )}
        <input
          placeholder="name"
          {...register(`cart.${index}.name` as const, {
            required: true,
          })}
          className={errors?.cart?.[index]?.name ? "error" : ""}
        />
        <input
          placeholder="quantity"
          type="number"
          {...register(`cart.${index}.quantity` as const, {
            valueAsNumber: true,
            required: true,
          })}
          className={errors?.cart?.[index]?.quantity ? "error" : ""}
        />
        <input
          placeholder="value"
          type="number"
          {...register(`cart.${index}.price` as const, {
            valueAsNumber: true,
            required: true,
          })}
          className={errors?.cart?.[index]?.price ? "error" : ""}
        />
        <button type="button" onClick={() => remove(index)}>
          削除
        </button>
      </section>
    </div>
  );
};

export const Form = ({ defaultValues }: { defaultValues: FormValues }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: defaultValues,
    mode: "onBlur",
  });
  const { fields, append, remove, move } = useFieldArray({
    name: "cart",
    control,
  });
  const onSubmit = (data: FormValues) => console.log(data);

  const moveBehind = () => {
    console.log("1つ上へ");
  };
  const moveForward = () => {
    console.log("1つ下へ");
  };

  const [fieldLength, setFieldLength] = useState(0);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
      {fields.map((field, index) => {
        return (
          <Row
            key={index}
            field={field}
            index={index}
            register={register}
            remove={remove}
            move={move}
            errors={errors}
            maxLength={fieldLength}
          />
        );
      })}

      <Total control={control} />

      <div>
        <button
          type="button"
          onClick={() => {
            setFieldLength(fieldLength + 1);
            append({
              name: "",
              quantity: 0,
              price: 0,
            });
          }}
        >
          追加
        </button>
        <input type="submit" onClick={(data) => console.log(data)} />
      </div>
    </form>
  );
};
