import { useState, useEffect } from 'react';

const FinishDialog = ({ show, onRestart }) => {
    const [images, setImages] = useState([1])
    const [showBtn, setShowBtn] = useState(false)
    let count = 1
    const startShow = () => {
        setTimeout(function () {
            count++;
            if (count <= 3) {
                const item = images
                item.push(count)
                setImages([...item])
                startShow();
            }
        }, 1000)
    }

    useEffect((val) => {
        if (images.length === 3) {
            setTimeout(function () {
                setShowBtn(true)
            }, 1000)
        }
    }, [images])

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            startShow()
        }
        return () => {
            isMounted = false
        }
    }, [])
    if (show) {
        return (
            <div className="finish-dialog">
                <div className="finish-dialog__title">
                    Congratulations! 恭喜過關!
                </div>
                <div className="finish-dialog__images">
                    {images.map((item, index) =>
                        <img src={`/images/img_clear_${item}.svg`} key={index} />
                    )}
                </div>
                {showBtn &&
                    <div className="finish-dialog__btn" onClick={onRestart}>再來一次...</div>
                }
            </div>
        )
    }
    else {
        return null
    }

}

export default FinishDialog