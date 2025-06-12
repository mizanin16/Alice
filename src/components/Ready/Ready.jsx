import React from 'react';
import './ready.css';
import { useForm, Controller } from "react-hook-form";
import { useState } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { HashLink as Link } from 'react-router-hash-link';
import 'react-phone-number-input/style.css';

function Ready(props) {

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


    function handleFormSubmit(data) {
        props.onSend({
            name: data.name,
            phone: data.phone,
            message: data.message,
            communication: data.communication,
        });
        closePopup();
    }

    const onSubmit = (data, e) => {
        e.preventDefault();
        handleFormSubmit(data);
    }

    function closePopup() {
        document.querySelector(".form-user-data").value = "";
        document.querySelector(".PhoneInputInput").value = "";
        document.querySelector(".popup-textarea").value = "";
        setIsName();
        setIsText();
    }

    function changeInputName(val) {
        if (val.length > 1 && val.length < 31) {
            if (/^[0-9а-яА-ЯёЁa-zA-Z\- ,.!?;:"'@#$%^&*()_+=]+$/.test(val)) {
                return setIsName(true);
            }
        }
        return
    }

    function changeInputText(val) {
        if (val.length > 1 && val.length < 31) {
            if (/^[0-9а-яА-ЯёЁa-zA-Z\- ,.!?;:"'@#$%^&*()_+=]+$/.test(val)) {
                return setIsText(true);
            }
        }
        return
    }

    return (
        <section className="ready" id='Ready'>
            <h2 className="section-title ready-title">Готовы начать?<br />Первый шаг за вами!</h2>
            <form action="" className="ready-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-user-data-container">
                    <input type="text" maxLength="30" className={`form-user-data ${errors?.name ? "form-user-data-error" :  isName ? "form-user-data-ok" : ""}`} placeholder='Введите имя'
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
                        })}
                    />
                    <Controller
                        name="phone"
                        control={control}
                        rules={{
                            validate: (value) => {
                                isValidPhoneNumber((value ?? 0).toString())
                            },
                            required: true
                        }}
                        render={({ field: { onChange, value } }) => (
                            <PhoneInput
                                required
                                className={`form-user-data ${isValidPhoneNumber((value ?? 0).toString()) ? "form-user-data-ok" : "form-user-data-error"}`}
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
                <textarea className={`form-message ${errors?.message ? "form-user-data-error" : isText ? "form-user-data-ok" : ""}`} maxLength="1000" placeholder='Опишите вашу проблему'
                    {...register("message", {
                        required: true,
                        validate: (input) => changeInputText(input),
                        minLength: {
                            value: 2,
                        },
                        maxLength: {
                            value: 1000,
                        }
                    })}
                />
                <div className="form-callback-types-container">
                    <label className="form-radio-text">
                        <input type="radio" name="telefone" value="telefone" className="form-callback-type" {...register("communication")} />Связаться по телефону
                    </label>
                    <label className="form-radio-text">
                        <input type="radio" name="watsapp" value="watsapp" className="form-callback-type" {...register("communication")} />Написать в WhatsApp
                    </label>
                    <label className="form-radio-text">
                        <input type="radio" name="telegramm" value="telegramm" className="form-callback-type" {...register("communication")} />Написать в Телеграм
                    </label>
                </div>
                <button type="submit" className="form-submit-btn" >Отправить заявку</button>
                <p className="form-policy-text">Нажимая кнопку “отправить заявку”, вы соглашаетесь <Link href="#" className="form-policy-underline">с политикой конфиденциальности</Link>.</p>
            </form>
        </section>
    );
};

export default Ready;
