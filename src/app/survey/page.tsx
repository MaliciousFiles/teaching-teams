"use client";

import {Slider} from "@/components/Slider";
import {useEffect, useRef, useState} from "react";
import {submit} from "@/util/submit";

export default function Survey() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const scores = [...Array(5)].map(() => useRef(2));
    const [submitted, setSubmitted] = useState(false);

    const doSubmit = async () => {
        await submit(scores.map(ref => ref.current!));
        setSubmitted(true);
    }

    const [pressed, setPressed] = useState(false);
    useEffect(() => {
        const release = (evt: Event) => {
            setPressed(false);
            evt.preventDefault();
        }

        document.addEventListener('touchend', () => setPressed(false));
        document.addEventListener('mouseup', () => setPressed(false));

        return () => {
            document.removeEventListener('touchend', release);
            document.removeEventListener('mouseup', release);
        }
    }, []);

 return submitted ? (
     <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 font-sans">
         <p className="flex py-8 text-xl mt-5 text-black">Thank you for your submission!</p>
     </div>
     )
 : (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 font-sans">
        <p className="flex py-8 text-xl mt-5 text-black">What Are&nbsp;<b>Your</b>&nbsp;Cultural Dimensions?</p>
      <main className="flex mb-20 flex-col items-center gap-10">
          <Slider title="Context" description="Do you assume that the audience has context or can infer from non-verbal cues, or do you provide all necessary information explicitly?"
                pos={scores[0]}
                leftDesc={{
                    title: "Low Context",
                    sub: "direct,\nspelled-out",
                }}
                rightDesc={{
                    title: "High Context",
                    sub: "indirect,\nnon-verbal",
                }}
                colors={{
                    main: "#b81919",
                    sliderInner: "#b67373",
                    sliderOuter: "#e19494",
                }}
        />
          <Slider title="Individuality" description="Do you prioritize personal liberties and freedom of action, or group cohesion, unity, and unilateral acceptance of decisions?"
                  pos={scores[1]}
                  leftDesc={{
                      title: "Individualism",
                      sub: "personal freedom",
                  }}
                  rightDesc={{
                      title: "Collectivism",
                      sub: "group agreement",
                  }}
                  colors={{
                      main: "#b85119",
                      sliderInner: "#b69173",
                      sliderOuter: "#e1b494",
                  }}
          />
          <Slider title="Time Orientation" description="Do you believe time is a precious commodity to be used wisely, or an unlimited resource to be enjoyed?"
                  pos={scores[2]}
                  leftDesc={{
                      title: "Monochronic",
                      sub: "time is money",
                  }}
                  rightDesc={{
                      title: "Polychronic",
                      sub: "time is fluid",
                  }}
                  colors={{
                      main: "#63b819",
                      sliderInner: "#8db673",
                      sliderOuter: "#afe194",
                  }}
          />
          <Slider title="Power Distance" description="Do you prefer egalitarian systems with shared power, or hierarchical structures with clear authority and distinct boundaries?"
                  pos={scores[3]}
                  leftDesc={{
                      title: "Low Distance",
                      sub: "subordinates help decide",
                  }}
                  rightDesc={{
                      title: "High Distance",
                      sub: "authoritarian leaders",
                  }}
                  colors={{
                      main: "#19b8a0",
                      sliderInner: "#73b6ae",
                      sliderOuter: "#94e1c3",
                  }}
          />
          <Slider title="Communication Style" description="Are words important and contracts binding, or are they just a tool to express ideas that approximate reality?"
                  pos={scores[4]}
                  leftDesc={{
                      title: "Low Context",
                      sub: "wording is crucial",
                  }}
                  rightDesc={{
                      title: "High Context",
                      sub: "context matters more",
                  }}
                  colors={{
                      main: "#7439a5",
                      sliderInner: "#9173b6",
                      sliderOuter: "#c594e1",
                  }}
          />
          <button onClick={doSubmit} onTouchStart={()=>setPressed(true)}
                  onMouseDown={()=>setPressed(true)}
                  className={"mt-3 mb-7 w-1/3 border-2 border-gray-600 rounded-full p-2 text-center text-gray-600"}
          style={{backgroundColor: pressed ? "#e1e1e1" : "#f4f4f4"}}>
              Submit
          </button>
      </main>
    </div>
  );
}
