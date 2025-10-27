"use client";

import React, {RefObject, useCallback, useEffect, useRef, useState} from "react";

export function Slider(props: {
    title: string,
    description: string,
    pos: RefObject<number>,
    leftDesc: {
        title: string,
        sub: string,
    },
    rightDesc: {
        title: string,
        sub: string,
    },
    colors: {
        main: string,
        sliderInner: string,
        sliderOuter: string
    }
}) {
    const [pos, setPos] = useState(2);
    useEffect(() => {
        props.pos.current = pos;
    }, [pos, props.pos]);

    const [dragging, setDragging] = useState(false);

    const dots = [...Array(5)]
        // eslint-disable-next-line react-hooks/rules-of-hooks
        .map(() => useRef<HTMLDivElement>(null));
    const background = useRef<HTMLDivElement>(null);
    const slider = useRef<HTMLDivElement>(null);

    const setSliderPos = (evt: MouseEvent|TouchEvent|React.MouseEvent|React.TouchEvent) => {
        evt.preventDefault();

        const rect = background.current!.getBoundingClientRect();

        let x;
        if ('touches' in evt) {
            x = evt.touches[0].clientX - rect.left;
        } else if ('clientX' in evt) {
            x = evt.clientX - rect.left;
        } else {
            return;
        }
        const max = rect.right - rect.left;
        const perc = Math.max(0, Math.min(1, x / max));

        setPos(Math.round(perc * 4));
    };

    useEffect(() => {
        const mouseUp = () => setDragging(false);
        if (dragging) {
            document.addEventListener('mousemove', setSliderPos);
            document.addEventListener('touchmove', setSliderPos);
        }
        document.addEventListener('mouseup', mouseUp);
        document.addEventListener('touchend', mouseUp);

        return () => {
            if (dragging) {
                document.removeEventListener('mousemove', setSliderPos);
                document.removeEventListener('touchmove', setSliderPos);
            }
            document.removeEventListener('mouseup', mouseUp);
            document.removeEventListener('touchend', mouseUp);
        };
    }, [dragging]);

    const curInterval = useRef<NodeJS.Timeout>(null);
    const setupInterval = useCallback(() => {
        if (!slider.current) return;

        if (curInterval.current) clearInterval(curInterval.current);

        const target = dots[pos].current!.offsetLeft + dots[pos].current!.offsetWidth/2 - slider.current!.offsetWidth/2;

        curInterval.current = setInterval(() => {
            if (!slider.current) return;

            const current = slider.current!.offsetLeft;
            const diff = target - current;
            const speed = diff/Math.abs(diff) * Math.min(2, Math.abs(diff));
            slider.current!.style.left = `${current + speed}px`;
        }, 1);
    }, [pos, dots, slider]);

    useEffect(setupInterval, [setupInterval]);

    const updateSlider = useCallback(() => {
        if (!slider.current) return;

        const target = dots[pos].current!.offsetLeft + dots[pos].current!.offsetWidth/2 - slider.current!.offsetWidth/2;
        slider.current!.style.left = `${target}px`;

        setupInterval();
    }, [pos, dots, slider]);
    useEffect(() => {
        window.addEventListener('resize', updateSlider);
        return () => window.removeEventListener('resize', updateSlider);
    }, [updateSlider]);

    return (
        <div className="flex-col w-11/12 rounded-2xl pt-3 pb-5 px-4 bg-white items-center gap-6 text-center sm:items-start sm:text-left">
            <p className="font-bold text-xl" style={{color: props.colors.main}}>{props.title}</p>
            <p className="italic text-xs text-gray-800">{props.description}</p>
            <div className="flex flex-row mt-4 items-center justify-between w-full">
                <div className="w-1/5 flex flex-col">
                    <p className="text-center font-medium text-black" style={{fontSize: "0.6rem"}}>{props.leftDesc.title}</p>
                    {
                        props.leftDesc.sub.split("\n").map((line, i) => (
                            <p key={i} className="text-center text-gray-700 leading-2.5" style={{fontSize: "0.5rem"}}>{line}</p>
                        ))
                    }
                </div>
                <div onMouseDown={setSliderPos} onTouchStart={setSliderPos} className="flex-1 flex px-5 flex-row items-center justify-between h-3.5 mx-2 bg-gray-200 rounded-full" ref={background}>
                    {
                        ([...Array(5)].map((_,i) => (
                            <div key={i} ref={dots[i]} className="h-1 w-1 bg-gray-400 rounded-full" />
                        )))
                    }
                </div>
                <div onMouseDown={evt => {
                        setDragging(true)
                        evt.preventDefault();
                    }}
                     onTouchStart={() => {
                         setDragging(true);
                     }}
                     className="h-6 w-6 touch-none rounded-full absolute flex left-1/2 items-center justify-center"
                     ref={slider}
                     style={{backgroundColor: props.colors.sliderOuter}}
                >
                    <div className="h-4 w-4 rounded-full" style={{backgroundColor: props.colors.sliderInner}}/>
                </div>
                <div className="w-1/5 flex flex-col">
                    <p className="text-center font-medium text-black" style={{fontSize: "0.6rem"}}>{props.rightDesc.title}</p>
                    {
                        props.rightDesc.sub.split("\n").map((line, i) => (
                            <p key={i} className="text-center text-gray-700 leading-2.5" style={{fontSize: "0.5rem"}}>{line}</p>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}