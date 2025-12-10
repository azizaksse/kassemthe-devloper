"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { MoveUpRight as ArrowIcon } from "lucide-react";
import Link from "next/link";
import styles from "./ImageReveal.module.scss";
import classNames from "classnames";

interface VisualItem {
    key: number;
    url: string;     // This should be the SCREENSHOT of your website
    link: string;    // This is the actual LINK to the website
    label: string;
}

const visualData: VisualItem[] = [
    {
        key: 1,
        url: "https://image.thum.io/get/width/800/crop/600/https://eventico-algeria.vercel.app/",
        link: "https://eventico-algeria.vercel.app/",
        label: "Eventico Algeria",
    },
    {
        key: 2,
        url: "https://image.thum.io/get/width/800/crop/600/https://ronaq-5ppm.vercel.app/",
        link: "https://ronaq-5ppm.vercel.app/",
        label: "Ronaq",
    },
    {
        key: 3,
        url: "https://image.thum.io/get/width/800/crop/600/https://sadek4vedio.vercel.app/",
        link: "https://sadek4vedio.vercel.app/",
        label: "Sadek Video",
    },
    {
        key: 4,
        url: "https://image.thum.io/get/width/800/crop/600/https://bidayati-e-learning.vercel.app/",
        link: "https://bidayati-e-learning.vercel.app/",
        label: "Bidayati",
    },
    {
        key: 5,
        url: "https://image.thum.io/get/width/800/crop/600/https://el-omda-voyage.vercel.app/",
        link: "https://el-omda-voyage.vercel.app/",
        label: "El Omda Voyage",
    },
];

const ImageReveal: React.FC = () => {
    const [focusedItem, setFocusedItem] = useState<VisualItem | null>(null);
    const [isLargeScreen, setIsLargeScreen] = useState(true);

    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);
    const smoothX = useSpring(cursorX, { stiffness: 300, damping: 40 });
    const smoothY = useSpring(cursorY, { stiffness: 300, damping: 40 });

    useEffect(() => {
        const updateScreen = () => {
            setIsLargeScreen(window.innerWidth >= 768);
        };
        updateScreen();
        window.addEventListener("resize", updateScreen);
        return () => window.removeEventListener("resize", updateScreen);
    }, []);

    const onMouseTrack = (e: React.MouseEvent) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
    };

    const onHoverActivate = (item: VisualItem) => {
        setFocusedItem(item);
    };

    const onHoverDeactivate = () => {
        setFocusedItem(null);
    };

    return (
        <div
            className={styles.container}
            onMouseMove={onMouseTrack}
            onMouseLeave={onHoverDeactivate}
        >
            {visualData.map((item) => (
                <Link
                    href={item.link}
                    key={item.key}
                    target="_blank" // Opens in new tab
                    rel="noopener noreferrer" // Security best practice
                    className={styles.linkBlock}
                >
                    <div
                        className={styles.item}
                        onMouseEnter={() => onHoverActivate(item)}
                    >
                        {/* Mobile Preview Fallback */}
                        {!isLargeScreen && (
                            <div className={styles.mobilePreviewContainer}>
                                <iframe
                                    src={item.link}
                                    className={styles.mobileIframe}
                                    title={item.label}
                                    loading="lazy"
                                />
                            </div>
                        )}

                        <h2
                            className={classNames(styles.label, {
                                [styles.labelActive]: focusedItem?.key === item.key
                            })}
                        >
                            {item.label}
                        </h2>

                        <button
                            className={classNames(styles.arrowButton, {
                                [styles.arrowButtonActive]: focusedItem?.key === item.key
                            })}
                        >
                            <ArrowIcon className="w-8 h-8" />
                        </button>

                        {/* Divider Line */}
                        <div
                            className={classNames(styles.divider, {
                                [styles.dividerActive]: focusedItem?.key === item.key
                            })}
                        />
                    </div>
                </Link>
            ))}

            {/* Pop Up Preview Iframe */}
            <AnimatePresence>
                {isLargeScreen && focusedItem && (
                    <motion.div
                        key="reveal-iframe"
                        className={styles.revealContainer}
                        style={{
                            left: smoothX,
                            top: smoothY,
                            x: "-50%",
                            y: "-50%",
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                        <iframe
                            src={focusedItem.link}
                            title={focusedItem.label}
                            className={styles.revealIframe}
                            loading="lazy"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageReveal;
