import React from "react";
import CmtWrapperParent from "./CmtWrapperParent";
import { useAppState } from "../../store/AppData";
import "../../styles/ExpandAndMore.css";

const ExpandAndMore = () => {
  const { isExpand, setIsExpand, isSearch, setIsSearch } = useAppState();
  if (!isExpand) return null;

  return (
    <div className="expand-container">
      <div className="main-expand">
        {isSearch ? (
          <>
            <div className="header-expand d-flex justify-content-between">
              <h5 className="mb-4">Tìm kiếm</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => {
                  setIsExpand(false);
                  setIsSearch(false);
                }}
              ></button>
            </div>
            <div className="search-container">
              <i className="bi bi-search search-icon"></i>
              <input type="text" className="search-input" placeholder="Tìm kiếm" />
            </div>
            <div  className="mt-3 mb-3" style={{fontWeight: "600",  fontSize: "17px"}}>Bạn có thể thích</div>
            <div className="list-expand">
            <div className="bt-list-search"><i className="bi bi-lightning-fill"></i><span>Tương lai bạn sẽ là ai?</span></div>
              <div className="bt-list-search"><i className="bi bi-capslock-fill"></i><span>Yên bình có quá đắt không</span></div>
              <div className="bt-list-search"><i className="bi bi-capslock-fill"></i><span>No pain no gain</span></div>
              <div className="bt-list-search"><i className="bi bi-lightning-fill"></i><span>Càng kỷ luật càng tự do</span></div>
              <div className="bt-list-search"><i className="bi bi-lightning-fill"></i><span>Mồ hôi là thước đo của thành...</span></div>
            </div>
          </>
        ) : (
          <>
            <div className="header-expand d-flex justify-content-between">
              <h5 className="mb-4">Thêm</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setIsExpand(false)}
              ></button>
            </div>
            <div className="list-expand">
              <div className="bt-list">Tạo hiệu ứng TikTok</div>
              <div className="bt-list"><span>Công cụ dành cho nhà sáng tạo</span> <i className="bi bi-chevron-right"></i></div>
              <div className="bt-list"><span>Tiếng Việt</span> <i className="bi bi-chevron-right"></i></div>
              <div className="bt-list"><span>Chế độ tối</span> <i className="bi bi-chevron-right"></i></div>
              <div className="bt-list">Phản hồi và trợ giúp</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpandAndMore;