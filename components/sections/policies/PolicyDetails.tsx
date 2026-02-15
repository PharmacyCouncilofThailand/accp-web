'use client'
import { useTranslations } from 'next-intl'

export default function PolicyDetails() {
    const t = useTranslations('policies')

    return (
        <div className="sp1" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-10 m-auto">

                        {/* Payment Method */}
                        <div className="mb-5" data-aos="fade-up" data-aos-duration={800}>
                            <h3 style={{ color: '#000', fontWeight: 'bold', marginBottom: '15px' }}>Payment Method</h3>
                            <p style={{ color: '#333', marginBottom: '10px' }}>
                                Payment for online registration is only possible by credit card.
                            </p>
                            <ul style={{ paddingLeft: '20px', color: '#333' }}>
                                <li style={{ marginBottom: '10px' }}>
                                    Once you have filled out all the required information for your registration, please click the “payment” button where a pop-up payment page will appear. Please complete all required information.
                                </li>
                            </ul>
                        </div>

                        {/* After Making the Payment */}
                        <div className="mb-5" data-aos="fade-up" data-aos-duration={800}>
                            <h3 style={{ color: '#000', fontWeight: 'bold', marginBottom: '15px' }}>After Making the Payment</h3>
                            <ul style={{ paddingLeft: '20px', color: '#333', marginBottom: '15px' }}>
                                <li style={{ marginBottom: '10px' }}>You can check the payment status at ‘Profile’.</li>
                                <li style={{ marginBottom: '10px' }}>
                                    Payment status will be changed from ‘<span style={{ color: 'red', fontWeight: 'bold' }}>Unpaid</span>’ to ‘<span style={{ color: '#4caf50', fontWeight: 'bold' }}>Paid</span>’ upon clearance of your payment.
                                </li>
                            </ul>
                            <p style={{ color: '#333', marginBottom: '5px', paddingLeft: '20px' }}>
                                <span style={{ color: 'red', fontWeight: 'bold' }}>Unpaid</span>: Payment has not been made yet.
                            </p>
                            <p style={{ color: '#333', marginBottom: '10px', paddingLeft: '20px' }}>
                                <span style={{ color: '#4caf50', fontWeight: 'bold' }}>Paid</span>: Registration and payment have been successfully completed.
                            </p>
                        </div>

                        {/* Confirmation of Registration */}
                        <div className="mb-5" data-aos="fade-up" data-aos-duration={800}>
                            <h3 style={{ color: '#000', fontWeight: 'bold', marginBottom: '15px' }}>Confirmation of Registration</h3>
                            <ul style={{ paddingLeft: '20px', color: '#333' }}>
                                <li style={{ marginBottom: '10px' }}>An automatic confirmation email will be sent to you upon the completion of your registration.</li>
                                <li style={{ marginBottom: '10px' }}>Registrants can check the status of their registration and payment on ‘Profile’ by logging into the online registration system.</li>
                                <li style={{ marginBottom: '10px' }}>Official receipt from the online registration system will be send to your email once your payment is completed.</li>
                                <li style={{ marginBottom: '10px' }}>Please note that the receipt will be available after your payment is completed.</li>
                            </ul>
                        </div>

                        {/* Cancellations & Refund Policy */}
                        <div className="mb-5" data-aos="fade-up" data-aos-duration={800}>
                            <h3 style={{ color: '#000', fontWeight: 'bold', marginBottom: '15px' }}>Cancellations & Refund Policy</h3>
                            <ul style={{ paddingLeft: '20px', color: '#333', marginBottom: '20px' }}>
                                <li style={{ marginBottom: '10px' }}>To cancel your registration and request for a refund, please download the below cancellation request form, fill it out, and send it to the secretariat via email before the deadline.</li>
                                <li style={{ marginBottom: '10px' }}>Refunds will be made according to the following cancellation & refund policy.</li>
                            </ul>

                            {/* Refund Table */}
                            <div className="table-responsive">
                                <table className="table table-bordered" style={{ border: '1px solid #000' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#673ab7' }}>
                                            <th style={{ color: '#fff', padding: '15px', fontSize: '20px', width: '50%' }}>Deadline</th>
                                            <th style={{ color: '#fff', padding: '15px', fontSize: '20px', width: '50%' }}>Refund Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '15px', border: '1px solid #000', fontSize: '18px', color: '#000' }}>Before 30 April 2026</td>
                                            <td style={{ padding: '15px', border: '1px solid #000', fontSize: '18px', color: '#000' }}>75% of registration fee</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '15px', border: '1px solid #000', fontSize: '18px', color: '#000' }}>1 – 31 May 2026</td>
                                            <td style={{ padding: '15px', border: '1px solid #000', fontSize: '18px', color: '#000' }}>40% of registration fee</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '15px', border: '1px solid #000', fontSize: '18px', color: '#000' }}>After 31 May 2026</td>
                                            <td style={{ padding: '15px', border: '1px solid #000', fontSize: '18px', color: '#000' }}>No refund</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
