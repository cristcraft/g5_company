import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";
import useUserData from "../../plugin/useUserData"
import apiInstance from "../../utils/axios";
import Moment from "../../plugin/Moment";
import Toast from "../../plugin/Toast"

function Notifications() {
    const [noti, setNoti] = useState([])
    const userId = useUserData()?.user_id

    const fetchNoti = async () => {
        try {
            const noti_res = await apiInstance.get(`author/dashboard/noti-list/${userId}`)
            setNoti(noti_res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const showNotiIcon = (noti) => {
        let type = noti.type
        switch (type) {
            case "Like":
                return <i className="fas fa-thumbs-up text-primary fs-5" />
                break;

            case "Comment":
                return <i className="fas fa-comment text-success fs-5" />
            break;

            case "Bookmark":
                return <i className="fas fa-bookmark text-danger fs-5" />
            break;
        
            default:
                break;
        }
    }

    const handleMarkNotiAsSeen = async (noti_id) =>{
        try {
            const response = await apiInstance.post(`author/dashboard/noti-mark-seen/`, {noti_id})
            console.log(response.data)
            fetchNoti()
            Toast("success", "Notification has been mark as seen")
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchNoti()
    }, [])
    return (
        <>
            <Header />
            <section className="pt-5 pb-5">
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            <div className="card mb-4">
                                <div className="card-header d-lg-flex align-items-center justify-content-between">
                                    <div className="mb-3 mb-lg-0">
                                        <h3 className="mb-0">Notifications</h3>
                                        <span>Manage all your notifications from here</span>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <ul className="list-group list-group-flush">
                                        {noti?.map((n, index)=>(
                                        <li className="list-group-item p-4 shadow rounded-3 mt-4">
                                            <div className="d-flex">
                                                <div className="ms-3 mt-2">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div>
                                                            <h4 className="mb-0 fw-bold">
                                                                {showNotiIcon(n)} New {n?.type}
                                                            </h4>
                                                            <p className="mt-3">
                                                                {`${n?.post?.user?.username} ${n?.type} your post`} <b> {`${n?.post?.title}`} </b>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2">
                                                        <p className="mt-1">
                                                            <span className="me-2 fw-bold">
                                                                Date: <span className="fw-light">{Moment(n.date)}</span>
                                                            </span>
                                                        </p>
                                                        <p>
                                                            <button onClick={()=> handleMarkNotiAsSeen(n?.id)} class="btn btn-outline-secondary" type="button">
                                                                Mark as Seen <i className="fas fa-check"></i>
                                                            </button>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        ))}

                                        {noti?.length < 1 &&
                                        <p>You don't have notifications</p>
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Notifications;
