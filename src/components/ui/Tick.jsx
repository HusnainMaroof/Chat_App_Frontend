import React from "react";
import styled from "styled-components";

const Checkbox = ({ labelContent, isChecked, onChange }) => {
  // Generate a unique ID if you plan to use multiple instances on one page
  const id = React.useId();

  return (
    <StyledWrapper>
      <div className="checkbox-wrapper-12">
        {/* Render content if provided */}
        {labelContent && <span className="content-text">{labelContent}</span>}
        <div className="cbx">
          <input
            checked={isChecked}
            onChange={onChange}
            type="checkbox"
            id={id}
          />
          <label htmlFor={id} />
          <svg fill="none" viewBox="0 0 15 14" height={14} width={15}>
            <path d="M2 8.36364L6.23077 12L13 2" />
          </svg>
        </div>

        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "none" }}
        >
          <defs>
            <filter id="goo-12">
              <feGaussianBlur
                result="blur"
                stdDeviation={4}
                in="SourceGraphic"
              />
              <feColorMatrix
                result="goo-12"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
                mode="matrix"
                in="blur"
              />
              <feBlend in2="goo-12" in="SourceGraphic" />
            </filter>
          </defs>
        </svg>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .checkbox-wrapper-12 {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px; /* Space between checkbox and text */
  }

  .content-text {
    font-family: sans-serif;
    cursor: pointer;
    user-select: none;
  }

  .checkbox-wrapper-12 > svg {
    position: absolute;
    top: -130%;
    left: -170%;
    width: 110px;
    pointer-events: none;
  }

  .checkbox-wrapper-12 * {
    box-sizing: border-box;
  }

  .checkbox-wrapper-12 .cbx {
    position: relative;
    width: 24px;
    height: 24px;
  }

  .checkbox-wrapper-12 .cbx input {
    -webkit-appearance: none;
    appearance: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 24px;
    border: 2px solid #bfbfc0;
    border-radius: 50%;
    cursor: pointer;
    margin: 0;
  }

  .checkbox-wrapper-12 .cbx label {
    width: 24px;
    height: 24px;
    background: none;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate3d(0, 0, 0);
    pointer-events: none;
  }

  .checkbox-wrapper-12 .cbx svg {
    position: absolute;
    top: 5px;
    left: 4px;
    z-index: 1;
    pointer-events: none;
  }

  .checkbox-wrapper-12 .cbx svg path {
    stroke: #fff;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 19;
    stroke-dashoffset: 19;
    transition: stroke-dashoffset 0.3s ease;
    transition-delay: 0.2s;
  }

  .checkbox-wrapper-12 .cbx input:checked + label {
    animation: splash-12 0.6s ease forwards;
  }

  .checkbox-wrapper-12 .cbx input:checked + label + svg path {
    stroke-dashoffset: 0;
  }

  @keyframes splash-12 {
    40% {
      background: #866efb;
      box-shadow: 0 -18px 0 -8px #866efb, 16px -8px 0 -8px #866efb,
        16px 8px 0 -8px #866efb, 0 18px 0 -8px #866efb, -16px 8px 0 -8px #866efb,
        -16px -8px 0 -8px #866efb;
    }
    100% {
      background: #866efb;
      box-shadow: 0 -36px 0 -10px transparent, 32px -16px 0 -10px transparent,
        32px 16px 0 -10px transparent, 0 36px 0 -10px transparent,
        -32px 16px 0 -10px transparent, -32px -16px 0 -10px transparent;
    }
  }
`;

export default Checkbox;
