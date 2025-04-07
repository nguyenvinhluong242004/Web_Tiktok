import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import VideoCard from "../components/layout/VideoCard";
import { fetchVideos } from "../services/apiHome";
import { useAppState } from "../../../store/UserData";
import "../styles/Profile.css";
import { getProfile } from "../services/apiAccount";
import { getVideoOfUser } from "../services/apiVideo";
import { useParams } from "react-router-dom";

import ChangeInformation from "../components/ui/ChangeInformation";
import VideoCardOnProfile from "../components/ui/VideoCardOnProfile";

const Profile = () => {
    const { handleScrollButton, homeRef, currentIndex, setCurrentIndex, isNewVideo, resetIsNewVideo, isCommentOpen, isExpand } = useAppState();
    const { uid } = useParams();
    const [activeTab, setActiveTab] = useState(0);
    const [activeFilter, setActiveFilter] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    // Khai báo các state để lưu thông tin profile
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [totalFollowers, setTotalFollowers] = useState(0);
    const [totalFollowing, setTotalFollowing] = useState(0);
    const [totalVideoLikes, setTotalVideoLikes] = useState(0);
    const [profileImage, setProfileImage] = useState('');
    const [user, setUser] = useState({});
    const [videos, setVideos] = useState([]);

    const moveTab = (index) => {
        setActiveTab(index);
    };

    const moveFilter = (index) => {
        setActiveFilter(index);
    };

    useEffect(() => {
        const user = async () => {
            console.log(uid);
            const result = await getProfile(uid);
            if (result.status) {
                setUser(result.data);
                setUserId(result.data.userid);
                setUsername(result.data.username);
                setEmail(result.data.email);
                setDateOfBirth(result.data.dateOfBirth);
                setTotalFollowers(result.data.totalFollowers);
                setTotalFollowing(result.data.totalFollowing);
                setTotalVideoLikes(result.data.totalVideoLikes);
                setProfileImage(result.data.profileImage);
            }
            else {
                console.log("NO USER");
            }
        };
        const video = async () => {
            console.log(uid);
            const result = await getVideoOfUser(uid);
            if (result.status) {
                console.log(result.data.videos);
                setVideos(result.data.videos);
                //console.log("Videos:", videos);
            }
            else {
                console.log("NO Video");
            }
        };
        user();
        video();
    }, []);


    return (
        <div className="profile-container">
            {/* Header */}
            <div className="header-prf">
                <div className="avt-prf">
                    {profileImage ? (
                        <img src={profileImage} alt="User Avatar" className="avatar-prf" />
                    ) : (
                        <div className="avatar-prf"></div>
                    )}
                </div>

                <div className="ct-prf">
                    <div className="prf-name d-flex gap-3 mb-1">
                        <h4 className="u-name">{userId}</h4>
                        <h5 className="fullname">{username}</h5>
                    </div>
                    <div className="d-flex mb-2">
                        <div className="btn-prf-change"
                            onClick={() => setIsOpen(true)}
                        >Sửa hồ sơ</div>
                        <div className="btn-prf">Quảng bá bài đăng</div>
                        <div className="btn-prf"><i className="bi bi-gear-wide"></i></div>
                        <div className="btn-prf"><i className="bi bi-reply" style={{ transform: "scaleX(-1)" }}></i></div>
                    </div>
                    {/* Stats */}
                    <div className="d-flex gap-4 mb-2">
                        <div className=""><b>{totalFollowing}</b> Đã follow</div>
                        <div className=""><b>{totalFollowers}</b> Follower</div>
                        <div className=""><b>{totalVideoLikes}</b> Lượt thích</div>
                    </div>
                    { /* Bio */}
                    <div className="bio-prf mb-2">
                        <p className="bio">{user.bio}</p>
                    </div>
                </div>
            </div>



            {/* Tabs */}
            <div className="h-prf-tab d-flex justify-content-between">
                {/* Tabs chính */}
                <div className="d-flex prf-tab">
                    {[
                        { id: 0, icon: "bi-list-ul", label: "Video" },
                        { id: 1, icon: "bi-bookmark-heart", label: "Yêu thích" },
                        { id: 2, icon: "bi-heart", label: "Đã thích" }
                    ].map(tab => (
                        <div
                            key={tab.id}
                            onClick={() => moveTab(tab.id)}
                            className={`tab ${activeTab === tab.id ? "active" : ""}`}
                        >
                            <i className={`bi ${tab.icon}`}></i> {tab.label}
                        </div>
                    ))}
                </div>

                {/* Tabs bộ lọc */}
                <div className="d-flex prf-filter-tab">
                    {["Mới nhất", "Thịnh Hành", "Cũ nhất"].map((label, index) => (
                        <div
                            key={index}
                            onClick={() => moveFilter(index)}
                            className={`filter-tab ${activeFilter === index ? "active" : ""}`}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Video Section */}
            <div className="video-section">
                {videos.map((video, index) => (
                    <VideoCardOnProfile key={index} video={video} />
                ))}
                {/* {videos ? (
                    <>
                    <VideoCardOnProfile key={0} video={videos[0]} />
                    <VideoCardOnProfile key={0} video={videos[0]} />
                    <VideoCardOnProfile key={0} video={videos[0]} />
                    <VideoCardOnProfile key={0} video={videos[0]} />
                    <VideoCardOnProfile key={0} video={videos[0]} />
                    <VideoCardOnProfile key={0} video={videos[0]} />
                    </>
                ) : (
                    <></>
                )} */}
            </div>

            {/* Upload Section */}
            {/* <div className="text-center mt-5">
                <div className="upload-icon">⬜</div>
                <p className="fw-bold">Tải video đầu tiên của bạn lên</p>
                <p>Video của bạn sẽ xuất hiện tại đây</p>
            </div> */}

            <ChangeInformation isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
        </div>
    );
};

export default Profile;
