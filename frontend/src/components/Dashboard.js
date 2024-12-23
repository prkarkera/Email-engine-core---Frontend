// import React, { useEffect, useState } from 'react';
// import axios from '../api/api'; // Ensure the axios instance is correctly configured
// import './Dashboard.css'; // Import the CSS file for styling

// const Dashboard = () => {
//     const [emails, setEmails] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [pageSize] = useState(10); // Emails per page

//     const email = localStorage.getItem('email');
//     const userId = localStorage.getItem('userId');

//     const fetchEmails = async (page) => {
//         if (!userId) {
//             setError('User ID is missing.');
//             return;
//         }

//         try {
//             setLoading(true);
//             const accessToken = localStorage.getItem('accessToken');
//             if (!accessToken) {
//                 setError('Access token is missing.');
//                 setLoading(false);
//                 return;
//             }

//             const response = await axios.get(`emails/fetch/${userId}`, {
//                 headers: { Authorization: `Bearer ${accessToken}` },
//                 params: { page, pageSize },
//             });

//             console.log(response);

//             const { emails, total } = response.data;
//             const totalPages = Math.ceil(total / pageSize);

//             if (emails.length > 0) {
//                 setEmails(emails);
//             } else {
//                 setEmails([]);
//             }
//             setTotalPages(totalPages);
//             setCurrentPage(page);
//         } catch (err) {
//             setError(err.response?.data?.message || 'Error fetching emails.');
//             console.error('Error fetching emails:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchEmails(currentPage);
//     }, [currentPage]);

//     const handlePageChange = (page) => {
//         if (page > 0 && page <= totalPages) {
//             setCurrentPage(page);
//         }
//     };

//     if (loading) {
//         return <div className="loading">Loading your emails...</div>;
//     }

//     if (error) {
//         return <div className="error">{error}</div>;
//     }

//     return (
//         <div className="dashboard">
//             <h1>Welcome, {email}</h1>
//             <h2>Your Emails</h2>
//             {emails.length === 0 ? (
//                 <p>No emails available.</p>
//             ) : (
//                 <ul className="email-list">
//                     {emails.map((email, index) => (
//                         <li key={index} className="email-item">
//                             <p><strong>Subject:</strong> {email.subject || 'No Subject'}</p>
//                             <p><strong>From:</strong> {email.from?.name || 'Unknown'}</p>
//                             <p><strong>Received on:</strong> {new Date(email.receivedDateTime).toLocaleString()}</p>
//                             <p><strong>Body Preview:</strong> {email.bodyPreview || 'No Preview Available'}</p>
//                             <p><strong>Read:</strong> {email.isRead ? 'Yes' : 'No'}</p>
//                             <p><strong>Importance:</strong> {email.importance}</p>
//                             <p><strong>Draft:</strong> {email.isDraft ? 'Yes' : 'No'}</p>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//             <div className="pagination">
//                 <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                 >
//                     Previous
//                 </button>
//                 <span>
//                     Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import axios from "../api/api"; // Ensure the axios instance is correctly configured
import "./Dashboard.css"; // Import the CSS file for styling

const Dashboard = () => {
    const [emails, setEmails] = useState([]); // State to store emails
    const [mailbox, setMailbox] = useState([]); // State to store mailbox folders
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state
    const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
    const [totalPages, setTotalPages] = useState(1); // Total number of pages for pagination
    const [pageSize] = useState(10); // Items per page
    const [activeTab, setActiveTab] = useState("emails"); // Active tab ("emails" or "mailbox")

    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");

    const fetchData = async (page, endpoint, setData) => {
        if (!userId) {
            setError("User ID is missing.");
            return;
        }

        try {
            setLoading(true);
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                setError("Access token is missing.");
                setLoading(false);
                return;
            }

            const response = await axios.get(`${endpoint}/${userId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: { page, pageSize },
            });

            console.log("API Response for " + endpoint, response.data); // Log the response for debugging

            const { emails: fetchedItems, total, mailbox: fetchedMailbox } = response.data;
            const totalPages = Math.ceil(total / pageSize);

            if (fetchedItems && fetchedItems.length > 0) {
                setData(fetchedItems); // Set emails or mailbox data
            } else if (fetchedMailbox) {
                setData(fetchedMailbox); // Set mailbox data if no emails
            } else {
                setData([]); // Set empty array if no data is found
            }
            setTotalPages(totalPages);
            setCurrentPage(page);
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching data.");
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "emails") {
            fetchData(currentPage, "emails/fetch", setEmails);
        } else if (activeTab === "mailbox") {
            fetchData(currentPage, "mailbox/fetch", setMailbox);
        }
    }, [currentPage, activeTab]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const renderItems = (items, type) => {
        if (type === "emails") {
            return (
                <ul className="email-list">
                    {items.map((item, index) => (
                        <li key={index} className="email-item">
                            <p><strong>Subject:</strong> {item.subject || "No Subject"}</p>
                            <p><strong>From:</strong> {item.from?.address || "Unknown"}</p>
                            <p><strong>Received on:</strong> {new Date(item.receivedDateTime).toLocaleString()}</p>
                            <p><strong>Body Preview:</strong> {item.bodyPreview || "No Preview Available"}</p>
                            <p><strong>Read:</strong> {item.isRead ? "Yes" : "No"}</p>
                            <p><strong>Importance:</strong> {item.importance}</p>
                            <p><strong>Draft:</strong> {item.isDraft ? "Yes" : "No"}</p>
                            <p><strong>To:</strong> {item.toRecipients?.map((to) => to.address)?.join(", ") || "Unknown"}</p>
                            <p><strong>BCC:</strong> {item.bccRecipients?.map((bcc) => bcc.address)?.join(", ") || "Unknown"}</p>
                            <p><strong>CC:</strong> {item.ccRecipients?.map((cc) => cc.address)?.join(", ") || "Unknown"}</p>



                        </li>
                    ))}
                </ul>
            );
        } else if (type === "mailbox") {
            return (
                <ul className="email-list">
                    {items.map((folder, index) => (
                        <li key={index} className="email-item">
                            <p><strong>Display Name:</strong> {folder.displayName || "Unnamed Folder"}</p>
                            <p><strong>Parent Folder ID:</strong> {folder.parentFolderId || "N/A"}</p>
                            <p><strong>Child Folder Count:</strong> {folder.childFolderCount}</p>
                            <p><strong>Total Item Count:</strong> {folder.totalItemCount}</p>
                            <p><strong>Unread Item Count:</strong> {folder.unreadItemCount}</p>
                        </li>
                    ))}
                </ul>
            );
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1); // Reset pagination when switching tabs
    };

    if (loading) {
        return <div className="loading">Loading your {activeTab}...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="dashboard">
            <h1>Welcome, {email}</h1>
            <div className="tabs">
                <button
                    className={activeTab === "emails" ? "active" : ""}
                    onClick={() => handleTabChange("emails")}
                >
                    Emails
                </button>
                <button
                    className={activeTab === "mailbox" ? "active" : ""}
                    onClick={() => handleTabChange("mailbox")}
                >
                    Mailbox
                </button>
            </div>
            <h2>Your {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            {activeTab === "emails" && emails.length === 0 && <p>No emails available.</p>}
            {activeTab === "mailbox" && mailbox.length === 0 && <p>No mailbox folders available.</p>}
            {activeTab === "emails" && renderItems(emails, "emails")}
            {activeTab === "mailbox" && renderItems(mailbox, "mailbox")}
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
