"use client";
import React, { useState } from "react";
import styles from "@/styles/ProfilePage.module.css";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState("orders");

  const user = {
    name: "Faisal Ansari",
    email: "faisal@example.com",
    avatar: "/images/profile-avatar.png",
  };

  return (
    <div className={styles.profile_container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.user_box}>
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={70}
            height={70}
            className={styles.avatar}
          />
          <div>
            <h4>{user.name}</h4>
            <p>{user.email}</p>
          </div>
        </div>

        <ul className={styles.menu_list}>
          <li
            className={activeSection === "orders" ? styles.active : ""}
            onClick={() => setActiveSection("orders")}
          >
            My Orders
          </li>
          <li
            className={activeSection === "wishlist" ? styles.active : ""}
            onClick={() => setActiveSection("wishlist")}
          >
            Wishlist
          </li>
          <li
            className={activeSection === "address" ? styles.active : ""}
            onClick={() => setActiveSection("address")}
          >
            Addresses
          </li>
          <li
            className={activeSection === "payments" ? styles.active : ""}
            onClick={() => setActiveSection("payments")}
          >
            Payments
          </li>
          <li
            className={activeSection === "settings" ? styles.active : ""}
            onClick={() => setActiveSection("settings")}
          >
            Account Settings
          </li>
          <li>
            <Link href="/" className={styles.logout_btn}>
              Logout
            </Link>
          </li>
        </ul>
      </aside>

      {/* Content Section */}
      <section className={styles.content}>
        {activeSection === "orders" && (
          <div className={styles.section_box}>
            <h3>My Orders</h3>
            <p>You haven’t placed any orders yet.</p>
          </div>
        )}

        {activeSection === "wishlist" && (
          <div className={styles.section_box}>
            <h3>My Wishlist</h3>
            <p>Your wishlist is empty. Start adding products you love!</p>
          </div>
        )}

        {activeSection === "address" && (
          <div className={styles.section_box}>
            <h3>Saved Addresses</h3>
            <p>No saved addresses. Add one to make checkout faster.</p>
          </div>
        )}

        {activeSection === "payments" && (
          <div className={styles.section_box}>
            <h3>Saved Payment Methods</h3>
            <p>You don’t have any saved cards yet.</p>
          </div>
        )}

        {activeSection === "settings" && (
          <div className={styles.section_box}>
            <h3>Account Settings</h3>
            <p>Edit your personal details and manage your account.</p>
          </div>
        )}
      </section>
    </div>
  );
}
