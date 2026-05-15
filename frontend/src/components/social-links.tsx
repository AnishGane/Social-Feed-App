import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";

interface SocialLinksProps {
    icon: React.ElementType,
    url: string,
    label: string
}

const SocialLinks = ({ label, icon, url }: SocialLinksProps) => {

    const Icon = icon;
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.a
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={label}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={cn("group flex items-center overflow-hidden rounded-full border-2 border-primary/50 bg-background p-2 cursor-pointer", isHovered && "border-primary/70")}
            initial={false}
            animate={{
                width: isHovered ? "auto" : 40,
                paddingRight: isHovered ? "0.5rem" : "0.5rem",
            }}
            transition={{
                type: "spring",
                stiffness: 180,
                damping: 20,
            }}
        >
            <motion.div
                animate={{
                    rotate: isHovered ? 8 : 0,
                    scale: isHovered ? 1.05 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 15,
                }}
                className="flex items-center justify-center min-w-5 min-h-5"
            >
                <Icon className="size-5 text-primary" />
            </motion.div>

            <AnimatePresence>
                {isHovered && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="ml-2 whitespace-nowrap text-sm text-foreground font-medium"
                    >
                        {label}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.a>
    )
}

export default SocialLinks
