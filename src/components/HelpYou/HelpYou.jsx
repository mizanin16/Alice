import React from 'react';
import './helpyou.css';
import HelpYouCards from "./HelpYouCards/HelpYouCards";
import HelpCardData from '../../utils/help-you-cards';
import arrow from '../../media/help-slider-arrow.svg';
import paw from "../../media/paw-gif.gif";
import { useCallback, useState, useEffect, useRef } from 'react';

function HelpYou() {
    const cards = HelpCardData;
    const wrapperRef = useRef(null);

    const [isCount, setCount] = useState(1);
    const [isCurrentCount, setIsCurrentCount] = useState(1);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);

    function changeCard(id) {
        const monitorCard = document.querySelector(".demeanor-monitor");
        const currentCard = cards[id];
        monitorCard.querySelector(".demeanor-img").src = currentCard.imgUrl;
        monitorCard.querySelector(".demeanor-title").textContent = currentCard.title;
        document.querySelector(".demeanor-item-slider").textContent = currentCard.title;
        monitorCard.querySelector(".demeanor-text").textContent = currentCard.text;
        monitorCard.id = id;
        setCount(id + 1);
        document.querySelector(".demeanor-range-position").textContent = `${id + 1} / ${cards.length}`
    }

    function clickSlider(goto) {
        const currentItem = document.querySelector(".demeanor-monitor");
        if (goto === "left") {
            if (Number(currentItem.id) === 0) {
                return;
            }
            changeCard(Number(currentItem.id) - 1)
            return;
        } else if (goto === "right") {
            if (Number(currentItem.id) === cards.length - 1) {
                return;
            }
            changeCard(Number(currentItem.id) + 1)
        }
    };

    function startSliderBtn(e) {
        const arrow = e.target.closest(".help-slider-arrow");
        if (arrow.classList.contains("help-slider-left")) {
            return clickSlider("left");
        } else if (arrow.classList.contains("help-slider-right")) {
            return clickSlider("right");
        }
    }

    function handleClick(id) {
        return setIsCurrentCount(id);
    }

    function handleMoveOut() {
        return changeCard(isCurrentCount);
    }

    useEffect(() => {
        document.querySelector(".demeanor-range-line-position").style.setProperty('width', `${handleLineLength()}px`);
        function handleLineLength() {
            const fullLine = document.querySelector(".demeanor-range-line").offsetWidth;
            let linePosition = fullLine / cards.length;
            linePosition = linePosition * isCount;
            return linePosition;
        }
    }, [cards.length, isCount]);

    const handleTouchStart = useCallback((e) => {
        if (!wrapperRef.current.contains(e.target)) {
            return;
        }
        setStartX(e.touches[0].clientX)
        setStartY(e.touches[0].clientY)
    }, [])

    const handleTouchEnd = useCallback((e) => {
        if (!wrapperRef.current.contains(e.target)) {
            return;
        }
        e.preventDefault()
        const endX = e.changedTouches[0].clientX
        const endY = e.changedTouches[0].clientY
        const deltaX = endX - startX
        const deltaY = endY - startY

        handleSwipe({ deltaX, deltaY })
    }, [startX, startY]);

    const handleSwipe = useCallback(({ deltaX, deltaY }) => {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
                return clickSlider("right");
            } else if (deltaX > 0) {
                return clickSlider("left");
            }
        }
    }, [])

    useEffect(() => {
        if (window.innerWidth < 883) {
            window.addEventListener("touchstart", handleTouchStart)
            window.addEventListener("touchend", handleTouchEnd)

            return () => {
                window.removeEventListener("touchstart", handleTouchStart)
                window.removeEventListener("touchend", handleTouchEnd)
            }
        } 
        return;
    }, [handleTouchStart, handleTouchEnd]);

    return (
        <section className="help-you" id='HelpYou'>
            <div className="title-container">
                <h2 className="section-title">Чем я могу помочь?</h2>
                <img src={paw} alt="лапки" className="help-paw" />
            </div>
            <div className="help-container">
                <div className="help-slider">
                    <div className="help-slider-arrow help-slider-left" onClick={startSliderBtn}><img src={arrow} alt="" className="help-slider-img" /></div>
                    <div className="demeanor-item-slider">{cards[0].title}</div>
                    <div className="help-slider-arrow help-slider-right" onClick={startSliderBtn}><img src={arrow} alt="" className="help-slider-img" /></div>
                </div>
                <ul className="demeanor-list">
                    <li className="demeanor-monitor" id={cards[0]._id} ref={wrapperRef}>
                        <img src={cards[0].imgUrl} alt="" className="demeanor-img demeanor-img-animate" />
                        <h3 className="demeanor-title">{cards[0].title}</h3>
                        <p className="demeanor-text">{cards[0].text}</p>
                    </li>
                    {cards.map((elem) => {
                        return <HelpYouCards
                            card={elem}
                            key={elem._id}
                            onChange={changeCard}
                            onClick={handleClick}
                            onMoveOut={handleMoveOut} />
                    })}
                </ul>
                <div className="demeanor-range">
                    <p className="demeanor-range-position">{`${1} / ${cards.length}`}</p>
                    <div className="demeanor-range-line">
                        <div className="demeanor-range-line-position"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HelpYou;
