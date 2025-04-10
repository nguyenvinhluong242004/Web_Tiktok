import { useRef, useState } from "react";
import { useAppState } from "../../../../store/UserData";
import "../../styles/InputComment.css"

const InputComment = ({ isClose }) => {
    const { setActiveCommentId } = useAppState();
    const textareaRef = useRef(null);
    const [text, setText] = useState("");
    const [showCount, setShowCount] = useState(false);
    const [isSet, setIsSet] = useState(false);

    const handleInput = (e) => {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';

        setText(e.target.value);
        console.log(textarea.scrollHeight)
        console.log(textarea.style.paddingBottom)
        if ((!showCount && textarea.scrollHeight >= 71) || (showCount && textarea.scrollHeight >= 97)) {
            if (isSet) return;
            setIsSet(true);
            setShowCount(true);
            console.log("set");
            textarea.style.paddingBottom = '36px'; // đủ chỗ cho bộ đếm
        } else {
            if (!isSet) return;
            setIsSet(false);
            setShowCount(false);
            console.log("reset");
            textarea.style.paddingBottom = '10px'; // mặc định
        }
    };

    return (
        <div className="ct-cmt-input">
            <div className="main-ct-cmt-input">
                <textarea
                    className="cmt-input"
                    name="Comment"
                    id="cmt-input"
                    maxLength={150}
                    ref={textareaRef}
                    rows={1}
                    value={text}
                    onChange={handleInput}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') e.preventDefault();
                    }}
                    placeholder="Nhập bình luận..."
                ></textarea>

                {/* Bộ đếm ký tự */}
                {showCount ? (
                    <div className="char-counter">{text.length}/150</div>
                ) : (
                    <></>
                )}
                {/* 2 nút ví dụ */}
                <div className="cmt-actions">
                    <button className="cmt-btn">@</button>
                    <button className="cmt-btn">🙂</button>
                </div>
            </div>
            {text.length > 0 ? (
                <div className="cmt-bt-done">Đăng</div>
            ) : (
                <div className="cmt-bt-done-not">Đăng</div>
            )}
            {isClose ? (
                <div className="close-input-cmt" onClick={() => setActiveCommentId(null)}><div>X</div></div>
            ) : (
                <></>
            )}
        </div>
    );
};

export default InputComment;
