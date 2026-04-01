import React from 'react';
import "./popup.css";
import { useForm, Controller } from "react-hook-form";
import { useState } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { HashLink as Link } from 'react-router-hash-link';
import 'react-phone-number-input/style.css';

function Popup(props) {

    const {
        register,
        formState: { errors, isValid },
        control,
        handleSubmit
    } = useForm({
        mode: "onChange",
        defaultValues: {
            communication: "telefone",
        },
    });

    const [isName, setIsName] = useState();
    const [isText, setIsText] = useState();
    const [isValidNumber, setIsValidNumber] = useState("");

    function handleFormSubmit(data, isSource) {
        props.onSend({
            name: data.name,
            phone: data.phone,
            message: data.message,
            communication: data.communication,
        }, isSource);
    }

    const onSubmit = (data, e) => {
        const isSource = "popup";
        e.preventDefault();
        return handleFormSubmit(data, isSource);
    }

    function closePopup() {
        document.querySelector(".popup-user-data").value = "";
        document.querySelector(".PhoneInputInput").value = "";
        document.querySelector(".popup-textarea").value = "";
        props.onClosePopup();
        setIsName();
        setIsText();
    }

    function changeInputName() {
        return setIsName(true);
    }

    function changeInputText() {
        return setIsText(true);
    }

    return (
        <div className="popup-cover popup-cover-disable">
            <div className="popup">
                <svg className="popup-close" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={closePopup}>
                    <rect width="27" height="1.00024" transform="matrix(0.710326 0.703873 -0.728678 0.684856 0.820312 0)" fill="#F6F6F6" />
                    <rect width="27" height="1.00024" transform="matrix(-0.710326 0.703873 -0.728678 -0.684856 19.9062 0.995117)" fill="#F6F6F6" />
                </svg>
                <form action="#" className="popup-container" onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="popup-title">Оставьте заявку, и я свяжусь с вами для первого шага!</h2>
                    <div className="popup-data-container">
                        <input type="text" className={`popup-user-data ${errors?.name ? "popup-user-data-error" : isName ? "popup-user-data-ok" : ""}`} placeholder="Имя"
                            {...register("name", {
                                required: true,
                                validate: (input) => changeInputName(input),
                                pattern: {
                                    value: /^[0-9а-яА-ЯёЁa-zA-Z\- ,.!?;:"'@#$%^&*()_+=]+$/,
                                },
                                minLength: {
                                    value: 2,
                                },
                                maxLength: {
                                    value: 30,
                                }
                            })} />

                        <Controller
                            name="phone"
                            control={control}
                            rules={{
                                validate: (value) => {
                                    setIsValidNumber(isValidPhoneNumber((value ?? 0).toString()));
                                    isValidPhoneNumber((value ?? 0).toString());
                                },
                                required: true,
                            }}
                            render={({ field: { onChange, value } }) => (
                                <PhoneInput
                                    className={`popup-user-data ${isValidNumber === "" ? "" : isValidNumber ? "popup-user-data-ok" : "popup-user-data-error"}`}
                                    required
                                    displayInitialValueAsLocalNumber
                                    international
                                    value={value}
                                    onChange={onChange}
                                    defaultCountry="RU"
                                    limitMaxLength
                                    id="popup-phone"
                                    rules={{ required: true }}
                                />
                            )}
                        />
                    </div>
                    <div className="popup-callback-container">
                        <textarea maxLength="300" type="text" className={`popup-textarea ${errors?.message ? "popup-textarea-error" : isText ? "popup-textarea-ok" : ""}`} placeholder="Опишите вашу проблему"
                            {...register("message", {
                                required: true,
                                validate: (input) => changeInputText(input),
                                pattern: {
                                    value: /^[0-9а-яА-ЯёЁa-zA-Z\- ,.!?;:"'@#$%^&*()_+=]+$/,
                                },
                                minLength: {
                                    value: 2,
                                },
                                maxLength: {
                                    value: 300,
                                }
                            })}
                        />
                        <div className="popup-radio-container">
                            <p className="popup-radio-text">
                                <input type="radio" name="telefone" className="popup-radio" value="telefone"
                                    {...register("communication")} />Связаться по телефону
                            </p>
                            <p className="popup-radio-text">
                                <input type="radio" name="watsapp" className="popup-radio" value="watsapp"
                                    {...register("communication")} />Написать в WhatsApp
                            </p>
                            <p className="popup-radio-text">
                                <input type="radio" name="telegramm" className="popup-radio" value="telegramm"
                                    {...register("communication")} />Написать в Телеграм
                            </p>
                        </div>
                    </div>
                    <button type="submit" className={`popup-submit-btn`} value="Отправить заявку" disabled={!isValid === true || !isValidNumber === true}>Отправить заявку</button>
                    <p className="popup-commit" lang="ru">Нажимая кнопку “отправить заявку”, вы соглашаетесь с <Link to="#" className="popup-commit popup-commit-link" rel="noopener noreferrer">политикой конфиденциальности</Link>.</p>
                </form>
            </div>
        </div>
    )
}

export default Popup;
