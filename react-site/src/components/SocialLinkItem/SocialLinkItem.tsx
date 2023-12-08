import { useState } from "react";
import { SocialLink } from "../../types";
import { Icon } from "@iconify/react";
import "./SocialLinkItem.scss";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { v4 as uuidv4 } from "uuid";

type TooltipPlacement =
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "bottom-end"
  | "bottom-start"
  | "left-end"
  | "left-start"
  | "right-end"
  | "right-start"
  | "top-end"
  | "top-start"
  | undefined;
const SocialLinkItem = ({
  link,
  defaultSetting,
}: {
  link: SocialLink;
  defaultSetting: {
    defaultOpen?: boolean;
    placement: TooltipPlacement;
    arrow: boolean;
  };
}) => {
  const [linkItem] = useState<SocialLink>(link);
  const [isHovered, setIsHovered] = useState<string | boolean>(false);

  const hoverIcon = (name?: string) => {
    setIsHovered(name ?? false);
  };
  return (
    <>
      <a href={linkItem.link} key={uuidv4()}>
        <Tooltip
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 200 }}
          title={linkItem.name}
          placement={defaultSetting.placement}
          disableInteractive
          open={defaultSetting.defaultOpen}
          arrow={defaultSetting.arrow}
          PopperProps={{
            sx: {
              ".MuiTooltip-tooltip": {
                backgroundColor:
                  linkItem.color === "#000000" ? "#ffffff" : linkItem.color,
                color: linkItem.color === "#000000" ? "#000000" : "#ffffff",
                fontSize: "clamp(14px, 2.5vw, 24px)",
                lineHeight: linkItem.size,
                borderRadius: "100px",
                textAlign: "center",
                verticalAlign: "middle",
                width: "clamp(100px, 11vw, 400px)",
                height: linkItem.size,
                cursor: "pointer",
              },
              ".MuiTooltip-arrow": {
                color:
                  linkItem.color === "#000000" ? "#ffffff" : linkItem.color,
              },
            },
          }}
        >
          <div
            className="social-links__link-item"
            onMouseEnter={() => hoverIcon(linkItem.name)}
            onMouseLeave={() => hoverIcon()}
            style={
              isHovered && isHovered === linkItem.name
                ? { backgroundColor: linkItem.color }
                : { backgroundColor: "white" }
            }
          >
            <Icon
              icon={linkItem.icon}
              color={
                isHovered && isHovered === linkItem.name ? "white" : "black"
              }
              width={linkItem.size}
            />
          </div>
        </Tooltip>
      </a>
    </>
  );
};

export default SocialLinkItem;
