import React, { InputHTMLAttributes, ReactElement } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Additional classNames for styling */
  className?: string;
  /** The regular expressions to validate */
  validationRegex?: RegExp;
  /** The type of input */
  type?: string;
  /** onChange handler */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const getValueToBePasted = (
  targetValue: string,
  regex: RegExp,
  text: string
): string => {
  if (!targetValue) {
    return "";
  }
  return regex.test(targetValue) ? targetValue : text;
};

const onChangeHandler = (
  e: React.ChangeEvent<HTMLInputElement>,
  validationRegex: RegExp,
  onChangeFn
) => {
  if (validationRegex) {
    // Typecast e.target to HTMLInputElement otherwise e.target.value
    // will throw compilation error
    const target = e.target as HTMLInputElement;
    // Getiing the reference of the hidden input element
    // whose sole purpose is to collect data
    // We will use this input element to store the
    // previous value while we add items to the current element
    const valStore = e.target.parentElement.lastChild as HTMLInputElement;

    // Pass the previous value and the current value to
    // the function to decide what to show
    const val = getValueToBePasted(
      target.value,
      validationRegex,
      valStore.value
    );
    // Update the values
    target.value = val;
    valStore.value = val;
  }
  onChangeFn(e);
};

const Input = React.forwardRef(
  (props: IProps, ref: React.Ref<HTMLInputElement>): ReactElement => {
    const { validationRegex, type, onChange, value, ...rest } = props;
    return (
      <div>
        <input
          ref={ref}
          type={type}
          onChange={e => onChangeHandler(e, validationRegex, onChange)}
          {...rest}
        />
        <input type="hidden" value="" />
      </div>
    );
  }
);

Input.defaultProps = {
  type: "text",
  className: "",
  validationRegex: null,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => {}
};

export default Input;
