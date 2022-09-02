import { useState, useEffect } from 'react';

const FinishDialog = () => {
    const [images, setImages] = useState([1])
    let count = 1
    const startShow = () => {
        setTimeout(function () {
            count++;
            if (count <= 3) {
                console.log(count)
                setImages(items => {
                    items.push(count)
                    return items
                })
                startShow();
            }
        }, 2000)
    }

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            startShow()
        }
        return () => {
            isMounted = false
        }
    })

    return (
        <div className="finish-dialog">
            <div className="finish-dialog__title">
                Congratulations! 恭喜過關!
            </div>
            <div className="finish-dialog__images">
                {images}
                {images.map(item=> {
                    <img src={`/images/img_clear_${item}.svg`}></img>
                })}
                
                {/* <img src="/images/img_clear_2.svg"></img>
                <img src="/images/img_clear_3.svg"></img> */}
            </div>
        </div>
    )
}

export default FinishDialog