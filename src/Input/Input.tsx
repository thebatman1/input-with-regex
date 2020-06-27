import React, { InputHTMLAttributes, ReactElement } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  validationRegex?: RegExp;
  type?: string;
}

interface IOptions {
  /** The value obtained from e.target.value */
  targetValue: string;
  /** The new text to be entered or pasted */
  text: string;
  /** The validation regex */
  regex: RegExp;
  /** The starl of the text selection */
  selectionStart: number;
  /** The end of the text selection */
  selectionEnd: number;
}

const getValueToBePasted = ({
  targetValue,
  text,
  regex,
  selectionStart,
  selectionEnd
}: IOptions): string => {
  let newValue: string;

  if (selectionStart === selectionEnd) {
    // If the text is not selected,
    // insert at the current cursor position
    newValue = `${targetValue.substring(
      0,
      selectionStart
    )}${text}${targetValue.substring(selectionStart)}`;
  } else {
    // if the text inside the input box is selected,
    // replace the selected text with given text
    newValue = targetValue.replace(
      targetValue.substring(selectionStart, selectionEnd),
      text
    );
  }
  return regex.test(newValue) ? newValue : targetValue;
};

const onPasteHandler = (
  e: React.ClipboardEvent<HTMLInputElement>,
  validationRegex: RegExp
) => {
  e.preventDefault();
  // Typecast e.target to HTMLInputElement otherwise e.target.value
  // will throw compilation error
  const target = e.target as HTMLInputElement;
  const { selectionStart, selectionEnd, value } = target;

  // Get the copied text and check if it can be pasted
  const clipboardText = e.clipboardData.getData("text");
  target.value = getValueToBePasted({
    targetValue: value,
    text: clipboardText,
    regex: validationRegex,
    selectionStart,
    selectionEnd
  });
  const cursorPosition =
    target.value !== value
      ? selectionStart + clipboardText.length
      : selectionEnd;
  target.selectionStart = cursorPosition;
  target.selectionEnd = cursorPosition;
};

const onKeyPressHandler = (
  e: React.KeyboardEvent<HTMLInputElement>,
  validationRegex: RegExp
) => {
  e.preventDefault();
  const target = e.target as HTMLInputElement;
  const { value, selectionStart, selectionEnd } = target;
  target.value = getValueToBePasted({
    targetValue: value,
    text: e.key,
    regex: validationRegex,
    selectionStart,
    selectionEnd
  });
  const cursorPosition =
    target.value !== value ? selectionStart + 1 : selectionEnd;
  target.selectionStart = cursorPosition;
  target.selectionEnd = cursorPosition;
};

const Input = React.forwardRef(
  (props: IProps, ref: React.Ref<HTMLInputElement>): ReactElement => {
    const { validationRegex, type } = props;
    return (
      <div>
        <input
          ref={ref}
          type={type}
          onPaste={e => onPasteHandler(e, validationRegex)}
          onKeyPress={e => onKeyPressHandler(e, validationRegex)}
        />
      </div>
    );
  }
);

Input.defaultProps = {
  type: "text",
  className: "",
  validationRegex: null
};

export default Input;
