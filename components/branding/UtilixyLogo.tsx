import * as React from "react";

type UtilixyLogoProps = {
  width?: number | string;
  height?: number | string;
  className?: string;
  title?: string;
  decorative?: boolean;
  style?: React.CSSProperties;
  loading?: "eager" | "lazy";
};

const RAW_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" version="1.2" viewBox="0 0 375 375">
  <defs>
    <clipPath id="a">
      <path d="M19.27 86.563h305.324v201.75H19.27Zm0 0"/>
    </clipPath>
    <clipPath id="b">
      <path d="M294.176 244.922c2.394-1.477 4.613-3.047 6.664-4.82 2.031-1.786 3.898-3.68 5.55-5.684 5.9-7.223 9.118-17.688 6.9-26.898a23.93 23.93 0 0 0-2.411-6.313c-1.074-1.984-2.371-3.855-3.926-5.52-6.105-6.796-15.25-10.648-24.656-11.28-9.453-.766-19.203 1.405-28.266 5.378-1.148.442-2.258 1.04-3.383 1.559-.523.258-1.207.566-1.601.777l-1.824.965c-1.18.652-2.118 1.18-3.246 1.851-1.094.641-2.176 1.313-3.25 1.997-4.305 2.734-8.43 5.808-12.48 9.046-8.106 6.497-15.704 13.915-23.337 21.614-7.668 7.68-15.344 15.707-23.683 23.511-8.372 7.747-17.473 15.29-27.848 21.602-10.324 6.344-22.102 11.117-34.348 13.555-6.125 1.203-12.336 1.89-18.508 2.015l-1.156.024-.855.004-2.578-.051c-.61.004-1.59-.067-2.43-.117-.856-.059-1.758-.102-2.574-.184-3.22-.332-6.438-.765-9.606-1.473-12.683-2.71-24.82-8.503-34.742-17.027-9.953-8.46-17.742-19.52-22.277-31.781-2.328-6.113-3.742-12.531-4.418-18.965l-.16-1.523-.063-1.028-.121-2.054-.031-.516-.016-.645-.02-1.304-.019-2.61c.094-3.254.309-6.484.785-9.699.93-6.418 2.602-12.75 5.113-18.73a79.927 79.927 0 0 1 9.657-16.774c3.879-5.16 8.422-9.785 13.422-13.824 5.011-4.031 10.57-7.352 16.402-9.996a74.955 74.955 0 0 1 18.297-5.613 50.88 50.88 0 0 1 4.734-.653c1.578-.203 3.168-.273 4.754-.355 1.586-.121 3.172-.047 4.754-.067l.863.004.516.032 1.027.058 2.063.121-9.266 5.563c4.059-7.598 9.031-14.68 14.863-20.938 5.813-6.261 12.375-11.797 19.536-16.355a100.224 100.224 0 0 1 22.894-10.719c8.016-2.562 16.34-3.98 24.633-4.398 4.148-.192 8.309-.16 12.414.254l2.922.261 3.152.434c2.125.25 4.133.672 6.137 1.09 4.02.84 7.953 2.011 11.797 3.355 1.93.649 3.797 1.484 5.683 2.219 1.86.82 3.676 1.738 5.493 2.613 1.765.996 3.554 1.926 5.273 2.973 1.688 1.105 3.441 2.086 5.05 3.289 1.63 1.176 3.286 2.289 4.817 3.582l2.328 1.871c.762.64 1.489 1.328 2.23 1.988 1.493 1.309 2.884 2.73 4.243 4.168 1.41 1.387 2.66 2.926 3.953 4.406 1.313 1.461 2.434 3.094 3.649 4.618 1.152 1.59 2.195 3.246 3.285 4.855-2.7-2.82-5.45-5.547-8.383-8.05-1.488-1.227-2.922-2.497-4.492-3.606l-2.309-1.707c-.773-.559-1.59-1.059-2.379-1.594-.793-.527-1.566-1.078-2.37-1.582l-2.45-1.457c-1.602-1.012-3.317-1.84-4.98-2.723-1.653-.906-3.426-1.586-5.118-2.39-1.722-.746-3.504-1.364-5.234-2.051l-5.336-1.691c-1.813-.45-3.578-1.008-5.399-1.375-3.625-.786-7.265-1.399-10.933-1.707-1.832-.172-3.664-.352-5.426-.36l-2.648-.082-2.899.063c-3.66.007-7.285.437-10.87.941-7.165 1.066-14.142 3.012-20.716 5.805a84.244 84.244 0 0 0-18.398 10.605 83.38 83.38 0 0 0-15.082 14.633c-4.344 5.469-8.063 11.395-10.938 17.688l-2.535 5.554-6.73.008-2.067.004h-1.027l-.516.004c.5.008.075.004.16.008l-.113.007-.219.012c-1.164.102-2.335.094-3.488.266-1.156.133-2.316.246-3.457.472a42.053 42.053 0 0 0-3.41.668 53.458 53.458 0 0 0-12.969 4.665c-8.191 4.16-15.265 10.37-20.515 17.78a56.552 56.552 0 0 0-6.352 11.958c-1.566 4.226-2.691 8.605-3.23 13.074-.29 2.227-.38 4.492-.41 6.73l.046 1.508.016.754.008.387.039.512.168 2.054.082 1.028c.027.336-.024-.309-.016-.207l.016.105.031.207.055.418a55.59 55.59 0 0 0 3.234 13.012c3.145 8.34 8.477 15.8 15.316 21.539a55.258 55.258 0 0 0 23.88 11.816c2.199.512 4.445.817 6.695 1.075.55.058 1.027.07 1.539.117.535.035.922.097 1.691.105l2.063.05.515.017c-.52-.008-.078-.004-.164-.004l.114-.004.226-.004.902-.008c4.84-.004 9.61-.45 14.305-1.273 9.39-1.664 18.356-5.168 26.953-10.024 8.606-4.855 16.766-11.137 24.754-18.058 8.04-6.883 15.91-14.426 24.117-21.965 8.23-7.516 16.852-15.016 26.309-21.79 4.723-3.39 9.7-6.523 14.879-9.367a124.697 124.697 0 0 1 3.926-2.062c1.285-.652 2.8-1.371 4.074-1.961l1.883-.84c.847-.379 1.437-.601 2.168-.906 1.402-.559 2.77-1.176 4.214-1.649 11.329-4.132 23.891-6.117 36.356-4.253 12.375 1.77 24.637 7.964 32.512 18.3 1.968 2.555 3.593 5.395 4.863 8.371a35.286 35.286 0 0 1 2.621 9.333c.465 3.195.523 6.457.082 9.628-.121 1.516-.594 3.368-.941 4.852l-.618 1.973-.214.691-.25.547-.5 1.086c-2.735 5.765-7.055 10.351-11.817 13.773a38.006 38.006 0 0 1-7.57 4.27c-2.625 1.12-5.348 2.015-8.078 2.539Zm0 0"/>
    </clipPath>
    <clipPath id="c">
      <path d="M294.176 244.922c2.394-1.477 4.613-3.047 6.664-4.82 2.031-1.786 3.898-3.68 5.55-5.684 5.9-7.223 9.118-17.688 6.9-26.898a23.93 23.93 0 0 0-2.411-6.313c-1.074-1.984-2.371-3.855-3.926-5.52-6.105-6.796-15.25-10.648-24.656-11.28-9.453-.766-19.203 1.405-28.266 5.378-1.148.442-2.258 1.04-3.383 1.559-.523.258-1.207.566-1.601.777l-1.824.965c-1.18.652-2.118 1.18-3.246 1.851-1.094.641-2.176 1.313-3.25 1.997-4.305 2.734-8.43 5.808-12.48 9.046-8.106 6.497-15.704 13.915-23.337 21.614-7.668 7.68-15.344 15.707-23.683 23.511-8.372 7.747-17.473 15.29-27.848 21.602-10.324 6.344-22.102 11.117-34.348 13.555-6.125 1.203-12.336 1.89-18.508 2.015l-1.156.024-.855.004-2.578-.051c-.61.004-1.59-.067-2.43-.117-.856-.059-1.758-.102-2.574-.184-3.22-.332-6.438-.765-9.606-1.473-12.683-2.71-24.82-8.503-34.742-17.027-9.953-8.46-17.742-19.52-22.277-31.781-2.328-6.113-3.742-12.531-4.418-18.965l-.16-1.523-.063-1.028-.121-2.054-.031-.516-.016-.645-.02-1.304-.019-2.61c.094-3.254.309-6.484.785-9.699.93-6.418 2.602-12.75 5.113-18.73a79.927 79.927 0 0 1 9.657-16.774c3.879-5.16 8.422-9.785 13.422-13.824 5.011-4.031 10.57-7.352 16.402-9.996a74.955 74.955 0 0 1 18.297-5.613 50.88 50.88 0 0 1 4.734-.653c1.578-.203 3.168-.273 4.754-.355 1.586-.121 3.172-.047 4.754-.067l.863.004.516.032 1.027.058 2.063.121-9.266 5.563c4.059-7.598 9.031-14.68 14.863-20.938 5.813-6.261 12.375-11.797 19.536-16.355a100.224 100.224 0 0 1 22.894-10.719c8.016-2.562 16.34-3.98 24.633-4.398 4.148-.192 8.309-.16 12.414.254l2.922.261 3.152.434c2.125.25 4.133.672 6.137 1.09 4.02.84 7.953 2.011 11.797 3.355 1.93.649 3.797 1.484 5.683 2.219 1.86.82 3.676 1.738 5.493 2.613 1.765.996 3.554 1.926 5.273 2.973 1.688 1.105 3.441 2.086 5.05 3.289 1.63 1.176 3.286 2.289 4.817 3.582l2.328 1.871c.762.64 1.489 1.328 2.23 1.988 1.493 1.309 2.884 2.73 4.243 4.168 1.41 1.387 2.66 2.926 3.953 4.406 1.313 1.461 2.434 3.094 3.649 4.618 1.152 1.59 2.195 3.246 3.285 4.855-2.7-2.82-5.45-5.547-8.383-8.05-1.488-1.227-2.922-2.497-4.492-3.606l-2.309-1.707c-.773-.559-1.59-1.059-2.379-1.594-.793-.527-1.566-1.078-2.37-1.582l-2.45-1.457c-1.602-1.012-3.317-1.84-4.98-2.723-1.653-.906-3.426-1.586-5.118-2.39-1.722-.746-3.504-1.364-5.234-2.051l-5.336-1.691c-1.813-.45-3.578-1.008-5.399-1.375-3.625-.786-7.265-1.399-10.933-1.707-1.832-.172-3.664-.352-5.426-.36l-2.648-.082-2.899.063c-3.66.007-7.285.437-10.87.941-7.165 1.066-14.142 3.012-20.716 5.805a84.244 84.244 0 0 0-18.398 10.605 83.38 83.38 0 0 0-15.082 14.633c-4.344 5.469-8.063 11.395-10.938 17.688l-2.535 5.554-6.73.008-2.067.004h-1.027l-.516.004c.5.008.075.004.16.008l-.113.007-.219.012c-1.164.102-2.335.094-3.488.266-1.156.133-2.316.246-3.457.472a42.053 42.053 0 0 0-3.41.668 53.458 53.458 0 0 0-12.969 4.665c-8.191 4.16-15.265 10.37-20.515 17.78a56.552 56.552 0 0 0-6.352 11.958c-1.566 4.226-2.691 8.605-3.23 13.074-.29 2.227-.38 4.492-.41 6.73l.046 1.508.016.754.008.387.039.512.168 2.054.082 1.028c.027.336-.024-.309-.016-.207l.016.105.031.207.055.418a55.59 55.59 0 0 0 3.234 13.012c3.145 8.34 8.477 15.8 15.316 21.539a55.258 55.258 0 0 0 23.88 11.816c2.199.512 4.445.817 6.695 1.075.55.058 1.027.07 1.539.117.535.035.922.097 1.691.105l2.063.05.515.017c-.52-.008-.078-.004-.164-.004l.114-.004.226-.004.902-.008c4.84-.004 9.61-.45 14.305-1.273 9.39-1.664 18.356-5.168 26.953-10.024 8.606-4.855 16.766-11.137 24.754-18.058 8.04-6.883 15.91-14.426 24.117-21.965 8.23-7.516 16.852-15.016 26.309-21.79 4.723-3.39 9.7-6.523 14.879-9.367a124.697 124.697 0 0 1 3.926-2.062c1.285-.652 2.8-1.371 4.074-1.961l1.883-.84c.847-.379 1.437-.601 2.168-.906 1.402-.559 2.77-1.176 4.214-1.649 11.329-4.132 23.891-6.117 36.356-4.253 12.375 1.77 24.637 7.964 32.512 18.3 1.968 2.555 3.593 5.395 4.863 8.371a35.286 35.286 0 0 1 2.621 9.333c.465 3.195.523 6.457.082 9.628-.121 1.516-.594 3.368-.941 4.852l-.618 1.973-.214.691-.25.547-.5 1.086c-2.735 5.765-7.055 10.351-11.817 13.773a38.006 38.006 0 0 1-7.57 4.27c-2.625 1.12-5.348 2.015-8.078 2.539"/>
    </clipPath>
    <clipPath id="d">
      <path d="M417.184 146.95 110.87-53.087-73.125 227.848l306.316 200.035Zm0 0"/>
    </clipPath>
    <clipPath id="f">
      <path d="M53.098 127.543H356v149.422H53.098Zm0 0"/>
    </clipPath>
    <clipPath id="g">
      <path d="m236.707 257.008 1.406.883c.91.605 2.332 1.394 4.14 2.418 3.665 2 9.274 4.554 16.657 6.351 7.348 1.735 16.668 2.567 26.63.656 1.32-.27 2.788-.472 4.042-.804 1.2-.352 2.414-.703 3.648-1.063 1.215-.281 2.5-.898 3.77-1.355 1.277-.489 2.578-.95 3.816-1.625 5.082-2.305 10.024-5.54 14.524-9.531 9.035-7.903 16.39-19.192 19.117-32.18.266-1.63.54-3.266.809-4.914.195-1.656.25-3.34.406-5.008l.035-.473c-.008.176.035-.613-.012.356l-.015-.742-.028-1.489-.058-2.996c.054-2.21-.348-3.465-.528-5.074l-.32-2.328-.617-2.504-.586-2.52c-.164-.847-.547-1.64-.8-2.464-1.024-3.309-2.505-6.489-4.169-9.563-3.414-6.117-7.984-11.707-13.515-16.254a56.4 56.4 0 0 0-18.875-10.176c-1.75-.441-3.5-.886-5.258-1.328l-5.38-.797c-1.808-.16-3.64-.14-5.452-.25l-.684-.035c-.441.004.41-.015.242-.008l-.21.008-2.09.078-3.352.133-.84.031c-.254.016-.457.055-.687.079l-1.348.16-2.695.297c-1.84.234-3.844.66-5.758.968-1.93.407-3.844.922-5.774 1.364l-5.714 1.734c-15.243 5.02-29.637 13.805-43.164 23.797a288.985 288.985 0 0 0-9.985 7.789 390.32 390.32 0 0 0-9.793 8.105c-6.469 5.5-12.793 11.172-19.191 16.692-6.367 5.504-12.762 11.09-19.207 16.215-6.559 5.21-13.356 10.363-20.965 14.433-7.52 4.094-15.941 7.153-24.566 7.961-1.067.145-2.16.121-3.227.184l-1.598.054c.325-.007-.672.012-.629.004l-.168-.011-1.004-.067c-.89-.058-1.78-.12-2.664-.18-1.011-.101-2.253-.304-3.351-.476-2.36-.297-4.219-.95-6.223-1.48-1.937-.649-3.828-1.38-5.62-2.227-7.157-3.469-13.032-8.371-17.321-13.934-4.238-5.613-7.016-11.773-8.29-17.797-1.288-5.988-1.152-11.949-.245-16.792.847-5.075 2.414-9.442 4.199-13.18 1.785-3.738 3.82-6.805 5.8-9.262 1.973-2.465 3.829-4.375 5.426-5.805a29.8 29.8 0 0 1 2.153-1.84 23.764 23.764 0 0 1 1.629-1.234l1.347-.969-1.093 1.243c-.727.808-1.739 2.074-2.97 3.754-2.46 3.335-5.597 8.66-7.609 15.875-.949 3.601-1.69 7.699-1.671 12.054-.028 4.551.566 8.985 2.285 13.516a35.926 35.926 0 0 0 8.16 12.578c3.758 3.684 8.469 6.71 13.723 8.484.632.286 1.335.368 2 .567.675.156 1.332.41 2.023.504 1.355.18 2.832.539 3.984.504.641.02 1.141.097 1.887.109.887-.031 1.774-.066 2.668-.102l.668-.023.336-.016.168-.004c.156-.004-.73 0-.29-.011l1.083-.168c.723-.13 1.45-.16 2.172-.356 5.777-1.191 11.601-3.742 17.293-7.57 5.71-3.75 11.351-8.531 17.07-13.86 5.816-5.453 11.668-11 17.676-16.89 5.984-5.871 12.195-11.844 18.676-17.844 6.464-6.023 13.289-11.996 20.582-17.68 14.492-11.402 31.05-21.808 49.964-28.218 9.524-3.102 19.243-5.106 29.829-5.672l3.351-.106 1.676-.05.418-.012.21-.008c-.019.004.958-.012.661-.004l.988.055c2.633.176 5.274.262 7.883.57 2.598.438 5.203.836 7.77 1.356 2.535.691 5.066 1.386 7.57 2.125 19.926 6.636 36.086 21.593 44.496 39.293 2.09 4.43 3.852 8.976 5.024 13.632.292 1.165.703 2.293.886 3.473l.602 3.516.562 3.492c.114 1.226.172 2.496.25 3.734.114 2.418.344 5.164.14 6.961l-.16 2.988-.077 1.489-.04.742c-.046 1.098-.03.426-.046.723l-.035.214-.06.422c-.343 2.25-.616 4.493-1.05 6.688-.539 2.176-1.062 4.34-1.66 6.453-2.582 8.437-6.602 16.086-11.535 22.586-4.95 6.492-10.703 11.922-16.844 16.152-6.144 4.215-12.566 7.434-19.004 9.356-1.57.582-3.191.937-4.777 1.308-1.606.348-3.082.817-4.75.996-1.613.227-3.203.45-4.77.668-1.52.164-2.836.13-4.23.204-11.848.472-21.785-2.188-29.27-5.446-7.515-3.281-12.59-7.183-15.87-9.883-1.637-1.394-2.813-2.515-3.571-3.3l-1.172-1.176Zm0 0"/>
    </clipPath>
    <clipPath id="h">
      <path d="m236.707 257.008 1.406.883c.91.605 2.332 1.394 4.14 2.418 3.665 2 9.274 4.554 16.657 6.351 7.348 1.735 16.668 2.567 26.63.656 1.32-.27 2.788-.472 4.042-.804 1.2-.352 2.414-.703 3.648-1.063 1.215-.281 2.5-.898 3.77-1.355 1.277-.489 2.578-.95 3.816-1.625 5.082-2.305 10.024-5.54 14.524-9.531 9.035-7.903 16.39-19.192 19.117-32.18.266-1.63.54-3.266.809-4.914.195-1.656.25-3.34.406-5.008l.035-.473c-.008.176.035-.613-.012.356l-.015-.742-.028-1.489-.058-2.996c.054-2.21-.348-3.465-.528-5.074l-.32-2.328-.617-2.504-.586-2.52c-.164-.847-.547-1.64-.8-2.464-1.024-3.309-2.505-6.489-4.169-9.563-3.414-6.117-7.984-11.707-13.515-16.254a56.4 56.4 0 0 0-18.875-10.176c-1.75-.441-3.5-.886-5.258-1.328l-5.38-.797c-1.808-.16-3.64-.14-5.452-.25l-.684-.035c-.441.004.41-.015.242-.008l-.21.008-2.09.078-3.352.133-.84.031c-.254.016-.457.055-.687.079l-1.348.16-2.695.297c-1.84.234-3.844.66-5.758.968-1.93.407-3.844.922-5.774 1.364l-5.714 1.734c-15.243 5.02-29.637 13.805-43.164 23.797a288.985 288.985 0 0 0-9.985 7.789 390.32 390.32 0 0 0-9.793 8.105c-6.469 5.5-12.793 11.172-19.191 16.692-6.367 5.504-12.762 11.09-19.207 16.215-6.559 5.21-13.356 10.363-20.965 14.433-7.52 4.094-15.941 7.153-24.566 7.961-1.067.145-2.16.121-3.227.184l-1.598.054c.325-.007-.672.012-.629.004l-.168-.011-1.004-.067c-.89-.058-1.78-.12-2.664-.18-1.011-.101-2.253-.304-3.351-.476-2.36-.297-4.219-.95-6.223-1.48-1.937-.649-3.828-1.38-5.62-2.227-7.157-3.469-13.032-8.371-17.321-13.934-4.238-5.613-7.016-11.773-8.29-17.797-1.288-5.988-1.152-11.949-.245-16.792.847-5.075 2.414-9.442 4.199-13.18 1.785-3.738 3.82-6.805 5.8-9.262 1.973-2.465 3.829-4.375 5.426-5.805a29.8 29.8 0 0 1 2.153-1.84 23.764 23.764 0 0 1 1.629-1.234l1.347-.969-1.093 1.243c-.727.808-1.739 2.074-2.97 3.754-2.46 3.335-5.597 8.66-7.609 15.875-.949 3.601-1.69 7.699-1.671 12.054-.028 4.551.566 8.985 2.285 13.516a35.926 35.926 0 0 0 8.16 12.578c3.758 3.684 8.469 6.71 13.723 8.484.632.286 1.335.368 2 .567.675.156 1.332.41 2.023.504 1.355.18 2.832.539 3.984.504.641.02 1.141.097 1.887.109.887-.031 1.774-.066 2.668-.102l.668-.023.336-.016.168-.004c.156-.004-.73 0-.29-.011l1.083-.168c.723-.13 1.45-.16 2.172-.356 5.777-1.191 11.601-3.742 17.293-7.57 5.71-3.75 11.351-8.531 17.07-13.86 5.816-5.453 11.668-11 17.676-16.89 5.984-5.871 12.195-11.844 18.676-17.844 6.464-6.023 13.289-11.996 20.582-17.68 14.492-11.402 31.05-21.808 49.964-28.218 9.524-3.102 19.243-5.106 29.829-5.672l3.351-.106 1.676-.05.418-.012.21-.008c-.019.004.958-.012.661-.004l.988.055c2.633.176 5.274.262 7.883.57 2.598.438 5.203.836 7.77 1.356 2.535.691 5.066 1.386 7.57 2.125 19.926 6.636 36.086 21.593 44.496 39.293 2.09 4.43 3.852 8.976 5.024 13.632.292 1.165.703 2.293.886 3.473l.602 3.516.562 3.492c.114 1.226.172 2.496.25 3.734.114 2.418.344 5.164.14 6.961l-.16 2.988-.077 1.489-.04.742c-.046 1.098-.03.426-.046.723l-.035.214-.06.422c-.343 2.25-.616 4.493-1.05 6.688-.539 2.176-1.062 4.34-1.66 6.453-2.582 8.437-6.602 16.086-11.535 22.586-4.95 6.492-10.703 11.922-16.844 16.152-6.144 4.215-12.566 7.434-19.004 9.356-1.57.582-3.191.937-4.777 1.308-1.606.348-3.082.817-4.75.996-1.613.227-3.203.45-4.77.668-1.52.164-2.836.13-4.23.204-11.848.472-21.785-2.188-29.27-5.446-7.515-3.281-12.59-7.183-15.87-9.883-1.637-1.394-2.813-2.515-3.571-3.3l-1.172-1.176"/>
    </clipPath>
    <clipPath id="i">
      <path d="M424.492 172.445 143.672-10.94-15.734 232.445 265.09 415.832Zm0 0"/>
    </clipPath>
    <radialGradient id="e" cx="0" cy="0" r="279.17" fx="0" fy="0" gradientTransform="matrix(-.54773 .83631 -.83752 -.54693 238.413 77.508)" gradientUnits="userSpaceOnUse">
      <stop offset="0" style="stop-color:#51ade5;stop-opacity:1"/>
      <stop offset=".004" style="stop-color:#50ace5;stop-opacity:1"/>
      <stop offset=".008" style="stop-color:#50ace4;stop-opacity:1"/>
      <stop offset=".012" style="stop-color:#50abe4;stop-opacity:1"/>
      <stop offset=".016" style="stop-color:#4fabe4;stop-opacity:1"/>
      <stop offset=".02" style="stop-color:#4faae3;stop-opacity:1"/>
      <stop offset=".023" style="stop-color:#4fa9e2;stop-opacity:1"/>
      <stop offset=".027" style="stop-color:#4fa8e2;stop-opacity:1"/>
      <stop offset=".031" style="stop-color:#4fa7e1;stop-opacity:1"/>
      <stop offset=".035" style="stop-color:#4fa7e1;stop-opacity:1"/>
      <stop offset=".039" style="stop-color:#4ea7e1;stop-opacity:1"/>
      <stop offset=".043" style="stop-color:#4ea6e0;stop-opacity:1"/>
      <stop offset=".047" style="stop-color:#4ea6e0;stop-opacity:1"/>
      <stop offset=".051" style="stop-color:#4ea5e0;stop-opacity:1"/>
      <stop offset=".055" style="stop-color:#4ea5e0;stop-opacity:1"/>
      <stop offset=".059" style="stop-color:#4ea4df;stop-opacity:1"/>
      <stop offset=".063" style="stop-color:#4da3df;stop-opacity:1"/>
      <stop offset=".066" style="stop-color:#4da3df;stop-opacity:1"/>
      <stop offset=".07" style="stop-color:#4ca2de;stop-opacity:1"/>
      <stop offset=".074" style="stop-color:#4ca1de;stop-opacity:1"/>
      <stop offset=".078" style="stop-color:#4ca1de;stop-opacity:1"/>
      <stop offset=".082" style="stop-color:#4ca0dd;stop-opacity:1"/>
      <stop offset=".086" style="stop-color:#4ca0dd;stop-opacity:1"/>
      <stop offset=".09" style="stop-color:#4c9fdd;stop-opacity:1"/>
      <stop offset=".094" style="stop-color:#4b9fdc;stop-opacity:1"/>
      <stop offset=".098" style="stop-color:#4b9edc;stop-opacity:1"/>
      <stop offset=".102" style="stop-color:#4b9edc;stop-opacity:1"/>
      <stop offset=".105" style="stop-color:#4b9ddb;stop-opacity:1"/>
      <stop offset=".109" style="stop-color:#4b9ddb;stop-opacity:1"/>
      <stop offset=".113" style="stop-color:#4b9cda;stop-opacity:1"/>
      <stop offset=".117" style="stop-color:#4a9cda;stop-opacity:1"/>
      <stop offset=".121" style="stop-color:#4a9bda;stop-opacity:1"/>
      <stop offset=".125" style="stop-color:#4a9bd9;stop-opacity:1"/>
      <stop offset=".129" style="stop-color:#4a9ad9;stop-opacity:1"/>
      <stop offset=".133" style="stop-color:#4a9ad9;stop-opacity:1"/>
      <stop offset=".137" style="stop-color:#4a99d8;stop-opacity:1"/>
      <stop offset=".141" style="stop-color:#4999d8;stop-opacity:1"/>
      <stop offset=".145" style="stop-color:#4998d7;stop-opacity:1"/>
      <stop offset=".148" style="stop-color:#4997d7;stop-opacity:1"/>
      <stop offset=".152" style="stop-color:#4896d6;stop-opacity:1"/>
      <stop offset=".156" style="stop-color:#4895d6;stop-opacity:1"/>
      <stop offset=".16" style="stop-color:#4895d6;stop-opacity:1"/>
      <stop offset=".164" style="stop-color:#4894d6;stop-opacity:1"/>
      <stop offset=".168" style="stop-color:#4894d5;stop-opacity:1"/>
      <stop offset=".172" style="stop-color:#4893d5;stop-opacity:1"/>
      <stop offset=".176" style="stop-color:#4793d5;stop-opacity:1"/>
      <stop offset=".18" style="stop-color:#4793d4;stop-opacity:1"/>
      <stop offset=".184" style="stop-color:#4792d4;stop-opacity:1"/>
      <stop offset=".188" style="stop-color:#4792d4;stop-opacity:1"/>
      <stop offset=".191" style="stop-color:#4791d3;stop-opacity:1"/>
      <stop offset=".195" style="stop-color:#4791d3;stop-opacity:1"/>
      <stop offset=".199" style="stop-color:#4791d2;stop-opacity:1"/>
      <stop offset=".203" style="stop-color:#4790d2;stop-opacity:1"/>
      <stop offset=".207" style="stop-color:#478fd2;stop-opacity:1"/>
      <stop offset=".211" style="stop-color:#468fd2;stop-opacity:1"/>
      <stop offset=".215" style="stop-color:#468ed1;stop-opacity:1"/>
      <stop offset=".219" style="stop-color:#468ed1;stop-opacity:1"/>
      <stop offset=".223" style="stop-color:#468dd0;stop-opacity:1"/>
      <stop offset=".227" style="stop-color:#468cd0;stop-opacity:1"/>
      <stop offset=".23" style="stop-color:#458bd0;stop-opacity:1"/>
      <stop offset=".234" style="stop-color:#458bd0;stop-opacity:1"/>
      <stop offset=".238" style="stop-color:#458acf;stop-opacity:1"/>
      <stop offset=".242" style="stop-color:#448acf;stop-opacity:1"/>
      <stop offset=".246" style="stop-color:#4489cf;stop-opacity:1"/>
      <stop offset=".25" style="stop-color:#4489ce;stop-opacity:1"/>
      <stop offset=".254" style="stop-color:#4488ce;stop-opacity:1"/>
      <stop offset=".258" style="stop-color:#4488ce;stop-opacity:1"/>
      <stop offset=".266" style="stop-color:#4487cd;stop-opacity:1"/>
      <stop offset=".27" style="stop-color:#4486cd;stop-opacity:1"/>
      <stop offset=".273" style="stop-color:#4386cc;stop-opacity:1"/>
      <stop offset=".277" style="stop-color:#4385cb;stop-opacity:1"/>
      <stop offset=".285" style="stop-color:#4385cb;stop-opacity:1"/>
      <stop offset=".289" style="stop-color:#4384ca;stop-opacity:1"/>
      <stop offset=".293" style="stop-color:#4284ca;stop-opacity:1"/>
      <stop offset=".297" style="stop-color:#4283c9;stop-opacity:1"/>
      <stop offset=".305" style="stop-color:#4282c9;stop-opacity:1"/>
      <stop offset=".309" style="stop-color:#4182c9;stop-opacity:1"/>
      <stop offset=".313" style="stop-color:#4181c9;stop-opacity:1"/>
      <stop offset=".316" style="stop-color:#4180c8;stop-opacity:1"/>
      <stop offset=".324" style="stop-color:#417fc8;stop-opacity:1"/>
      <stop offset=".328" style="stop-color:#417fc7;stop-opacity:1"/>
      <stop offset=".332" style="stop-color:#417ec7;stop-opacity:1"/>
      <stop offset=".336" style="stop-color:#417ec7;stop-opacity:1"/>
      <stop offset=".34" style="stop-color:#407dc7;stop-opacity:1"/>
      <stop offset=".344" style="stop-color:#407dc6;stop-opacity:1"/>
      <stop offset=".348" style="stop-color:#407cc6;stop-opacity:1"/>
      <stop offset=".352" style="stop-color:#407cc5;stop-opacity:1"/>
      <stop offset=".355" style="stop-color:#407bc5;stop-opacity:1"/>
      <stop offset=".359" style="stop-color:#407bc5;stop-opacity:1"/>
      <stop offset=".363" style="stop-color:#407ac4;stop-opacity:1"/>
      <stop offset=".367" style="stop-color:#3f7ac4;stop-opacity:1"/>
      <stop offset=".371" style="stop-color:#3f79c4;stop-opacity:1"/>
      <stop offset=".379" style="stop-color:#3e79c3;stop-opacity:1"/>
      <stop offset=".383" style="stop-color:#3e78c3;stop-opacity:1"/>
      <stop offset=".391" style="stop-color:#3e77c2;stop-opacity:1"/>
      <stop offset=".395" style="stop-color:#3e77c2;stop-opacity:1"/>
      <stop offset=".398" style="stop-color:#3e76c1;stop-opacity:1"/>
      <stop offset=".406" style="stop-color:#3e76c1;stop-opacity:1"/>
      <stop offset=".41" style="stop-color:#3e75c1;stop-opacity:1"/>
      <stop offset=".414" style="stop-color:#3d75c0;stop-opacity:1"/>
      <stop offset=".418" style="stop-color:#3d74c0;stop-opacity:1"/>
      <stop offset=".422" style="stop-color:#3d73c0;stop-opacity:1"/>
      <stop offset=".426" style="stop-color:#3d73bf;stop-opacity:1"/>
      <stop offset=".43" style="stop-color:#3d72bf;stop-opacity:1"/>
      <stop offset=".438" style="stop-color:#3d71be;stop-opacity:1"/>
      <stop offset=".441" style="stop-color:#3d71bd;stop-opacity:1"/>
      <stop offset=".445" style="stop-color:#3c70bd;stop-opacity:1"/>
      <stop offset=".453" style="stop-color:#3c6fbd;stop-opacity:1"/>
      <stop offset=".457" style="stop-color:#3b6fbc;stop-opacity:1"/>
      <stop offset=".461" style="stop-color:#3b6ebc;stop-opacity:1"/>
      <stop offset=".465" style="stop-color:#3b6ebb;stop-opacity:1"/>
      <stop offset=".473" style="stop-color:#3b6dbb;stop-opacity:1"/>
      <stop offset=".477" style="stop-color:#3b6dbb;stop-opacity:1"/>
      <stop offset=".48" style="stop-color:#3b6cba;stop-opacity:1"/>
      <stop offset=".484" style="stop-color:#3b6cba;stop-opacity:1"/>
      <stop offset=".492" style="stop-color:#3b6bb9;stop-opacity:1"/>
      <stop offset=".496" style="stop-color:#3a6ab9;stop-opacity:1"/>
      <stop offset=".504" style="stop-color:#3a6ab9;stop-opacity:1"/>
      <stop offset=".508" style="stop-color:#3a69b9;stop-opacity:1"/>
      <stop offset=".512" style="stop-color:#3a69b8;stop-opacity:1"/>
      <stop offset=".516" style="stop-color:#3a68b8;stop-opacity:1"/>
      <stop offset=".52" style="stop-color:#3968b7;stop-opacity:1"/>
      <stop offset=".523" style="stop-color:#3967b7;stop-opacity:1"/>
      <stop offset=".527" style="stop-color:#3967b7;stop-opacity:1"/>
      <stop offset=".531" style="stop-color:#3966b6;stop-opacity:1"/>
      <stop offset=".535" style="stop-color:#3966b6;stop-opacity:1"/>
      <stop offset=".539" style="stop-color:#3965b6;stop-opacity:1"/>
      <stop offset=".543" style="stop-color:#3965b6;stop-opacity:1"/>
      <stop offset=".547" style="stop-color:#3864b5;stop-opacity:1"/>
      <stop offset=".551" style="stop-color:#3864b5;stop-opacity:1"/>
      <stop offset=".555" style="stop-color:#3864b4;stop-opacity:1"/>
      <stop offset=".559" style="stop-color:#3863b4;stop-opacity:1"/>
      <stop offset=".563" style="stop-color:#3862b4;stop-opacity:1"/>
      <stop offset=".566" style="stop-color:#3862b3;stop-opacity:1"/>
      <stop offset=".57" style="stop-color:#3861b3;stop-opacity:1"/>
      <stop offset=".582" style="stop-color:#3860b3;stop-opacity:1"/>
      <stop offset=".586" style="stop-color:#3760b2;stop-opacity:1"/>
      <stop offset=".598" style="stop-color:#375fb1;stop-opacity:1"/>
      <stop offset=".602" style="stop-color:#365fb0;stop-opacity:1"/>
      <stop offset=".605" style="stop-color:#365eb0;stop-opacity:1"/>
      <stop offset=".609" style="stop-color:#365eb0;stop-opacity:1"/>
      <stop offset=".613" style="stop-color:#365daf;stop-opacity:1"/>
      <stop offset=".617" style="stop-color:#365daf;stop-opacity:1"/>
      <stop offset=".621" style="stop-color:#365caf;stop-opacity:1"/>
      <stop offset=".625" style="stop-color:#365cae;stop-opacity:1"/>
      <stop offset=".629" style="stop-color:#365bae;stop-opacity:1"/>
      <stop offset=".637" style="stop-color:#365bae;stop-opacity:1"/>
      <stop offset=".641" style="stop-color:#365aad;stop-opacity:1"/>
      <stop offset=".645" style="stop-color:#355aad;stop-opacity:1"/>
      <stop offset=".648" style="stop-color:#3559ad;stop-opacity:1"/>
      <stop offset=".656" style="stop-color:#3558ac;stop-opacity:1"/>
      <stop offset=".664" style="stop-color:#3557ac;stop-opacity:1"/>
      <stop offset=".668" style="stop-color:#3557ac;stop-opacity:1"/>
      <stop offset=".672" style="stop-color:#3456ab;stop-opacity:1"/>
      <stop offset=".68" style="stop-color:#3456ab;stop-opacity:1"/>
      <stop offset=".684" style="stop-color:#3455aa;stop-opacity:1"/>
      <stop offset=".688" style="stop-color:#3455aa;stop-opacity:1"/>
      <stop offset=".691" style="stop-color:#3454a9;stop-opacity:1"/>
      <stop offset=".699" style="stop-color:#3453a9;stop-opacity:1"/>
      <stop offset=".703" style="stop-color:#3352a9;stop-opacity:1"/>
      <stop offset=".719" style="stop-color:#3352a8;stop-opacity:1"/>
      <stop offset=".723" style="stop-color:#3352a7;stop-opacity:1"/>
      <stop offset=".727" style="stop-color:#3351a7;stop-opacity:1"/>
      <stop offset=".73" style="stop-color:#3351a6;stop-opacity:1"/>
      <stop offset=".734" style="stop-color:#3250a6;stop-opacity:1"/>
      <stop offset=".742" style="stop-color:#3250a5;stop-opacity:1"/>
      <stop offset=".75" style="stop-color:#324fa4;stop-opacity:1"/>
      <stop offset=".754" style="stop-color:#324ea4;stop-opacity:1"/>
      <stop offset=".758" style="stop-color:#324ea4;stop-opacity:1"/>
      <stop offset=".762" style="stop-color:#324da4;stop-opacity:1"/>
      <stop offset=".766" style="stop-color:#324da4;stop-opacity:1"/>
      <stop offset=".77" style="stop-color:#314ca3;stop-opacity:1"/>
      <stop offset=".773" style="stop-color:#314ca3;stop-opacity:1"/>
      <stop offset=".777" style="stop-color:#314ca3;stop-opacity:1"/>
      <stop offset=".781" style="stop-color:#314ba2;stop-opacity:1"/>
      <stop offset=".785" style="stop-color:#314ba2;stop-opacity:1"/>
      <stop offset=".789" style="stop-color:#314aa2;stop-opacity:1"/>
      <stop offset=".793" style="stop-color:#314aa1;stop-opacity:1"/>
      <stop offset=".797" style="stop-color:#314aa1;stop-opacity:1"/>
      <stop offset=".801" style="stop-color:#3149a1;stop-opacity:1"/>
      <stop offset=".805" style="stop-color:#3149a1;stop-opacity:1"/>
      <stop offset=".809" style="stop-color:#3149a0;stop-opacity:1"/>
      <stop offset=".813" style="stop-color:#3048a0;stop-opacity:1"/>
      <stop offset=".816" style="stop-color:#30489f;stop-opacity:1"/>
      <stop offset=".82" style="stop-color:#30479f;stop-opacity:1"/>
      <stop offset=".828" style="stop-color:#30469f;stop-opacity:1"/>
      <stop offset=".836" style="stop-color:#30469e;stop-opacity:1"/>
      <stop offset=".844" style="stop-color:#2f459e;stop-opacity:1"/>
      <stop offset=".848" style="stop-color:#2f459d;stop-opacity:1"/>
      <stop offset=".852" style="stop-color:#2f459d;stop-opacity:1"/>
      <stop offset=".855" style="stop-color:#2f449d;stop-opacity:1"/>
      <stop offset=".859" style="stop-color:#2f449d;stop-opacity:1"/>
      <stop offset=".863" style="stop-color:#2f449c;stop-opacity:1"/>
      <stop offset=".871" style="stop-color:#2f439c;stop-opacity:1"/>
      <stop offset=".879" style="stop-color:#2f429b;stop-opacity:1"/>
      <stop offset=".883" style="stop-color:#2f429b;stop-opacity:1"/>
      <stop offset=".887" style="stop-color:#2f419a;stop-opacity:1"/>
      <stop offset=".891" style="stop-color:#2f419a;stop-opacity:1"/>
      <stop offset=".895" style="stop-color:#2e419a;stop-opacity:1"/>
      <stop offset=".898" style="stop-color:#2e4099;stop-opacity:1"/>
      <stop offset=".902" style="stop-color:#2e4099;stop-opacity:1"/>
      <stop offset=".906" style="stop-color:#2e3f98;stop-opacity:1"/>
      <stop offset=".918" style="stop-color:#2e3e98;stop-opacity:1"/>
      <stop offset=".922" style="stop-color:#2e3e97;stop-opacity:1"/>
      <stop offset=".926" style="stop-color:#2e3e97;stop-opacity:1"/>
      <stop offset=".934" style="stop-color:#2d3d97;stop-opacity:1"/>
      <stop offset=".938" style="stop-color:#2d3c96;stop-opacity:1"/>
      <stop offset=".941" style="stop-color:#2d3c96;stop-opacity:1"/>
      <stop offset=".945" style="stop-color:#2d3b96;stop-opacity:1"/>
      <stop offset=".949" style="stop-color:#2d3b95;stop-opacity:1"/>
      <stop offset=".961" style="stop-color:#2d3a95;stop-opacity:1"/>
      <stop offset=".965" style="stop-color:#2d3a94;stop-opacity:1"/>
      <stop offset=".969" style="stop-color:#2c3a94;stop-opacity:1"/>
      <stop offset=".977" style="stop-color:#2c3993;stop-opacity:1"/>
      <stop offset=".98" style="stop-color:#2c3993;stop-opacity:1"/>
      <stop offset=".984" style="stop-color:#2c3992;stop-opacity:1"/>
      <stop offset="1" style="stop-color:#2c3892;stop-opacity:1"/>
    </radialGradient>
    <radialGradient id="j" cx="0" cy="0" r="279.17" fx="0" fy="0" gradientTransform="matrix(-.54773 .83631 -.83752 -.54693 238.413 77.508)" gradientUnits="userSpaceOnUse">
      <stop offset="0" style="stop-color:#00adef;stop-opacity:1"/>
      <stop offset=".008" style="stop-color:#01adee;stop-opacity:1"/>
      <stop offset=".012" style="stop-color:#01acee;stop-opacity:1"/>
      <stop offset=".016" style="stop-color:#01acee;stop-opacity:1"/>
      <stop offset=".02" style="stop-color:#02acee;stop-opacity:1"/>
      <stop offset=".023" style="stop-color:#02acee;stop-opacity:1"/>
      <stop offset=".027" style="stop-color:#02acee;stop-opacity:1"/>
      <stop offset=".031" style="stop-color:#02abed;stop-opacity:1"/>
      <stop offset=".035" style="stop-color:#03abed;stop-opacity:1"/>
      <stop offset=".047" style="stop-color:#03abed;stop-opacity:1"/>
      <stop offset=".051" style="stop-color:#03aaed;stop-opacity:1"/>
      <stop offset=".055" style="stop-color:#03aaec;stop-opacity:1"/>
      <stop offset=".059" style="stop-color:#04aaec;stop-opacity:1"/>
      <stop offset=".063" style="stop-color:#04aaec;stop-opacity:1"/>
      <stop offset=".066" style="stop-color:#04aaec;stop-opacity:1"/>
      <stop offset=".07" style="stop-color:#05a9eb;stop-opacity:1"/>
      <stop offset=".082" style="stop-color:#05a9eb;stop-opacity:1"/>
      <stop offset=".086" style="stop-color:#06a9eb;stop-opacity:1"/>
      <stop offset=".09" style="stop-color:#06a8eb;stop-opacity:1"/>
      <stop offset=".102" style="stop-color:#06a8ea;stop-opacity:1"/>
      <stop offset=".105" style="stop-color:#07a7ea;stop-opacity:1"/>
      <stop offset=".117" style="stop-color:#07a7ea;stop-opacity:1"/>
      <stop offset=".121" style="stop-color:#07a7ea;stop-opacity:1"/>
      <stop offset=".125" style="stop-color:#08a7e9;stop-opacity:1"/>
      <stop offset=".129" style="stop-color:#08a6e9;stop-opacity:1"/>
      <stop offset=".141" style="stop-color:#08a6e9;stop-opacity:1"/>
      <stop offset=".145" style="stop-color:#08a5e9;stop-opacity:1"/>
      <stop offset=".148" style="stop-color:#09a5e8;stop-opacity:1"/>
      <stop offset=".152" style="stop-color:#09a5e8;stop-opacity:1"/>
      <stop offset=".156" style="stop-color:#09a5e8;stop-opacity:1"/>
      <stop offset=".16" style="stop-color:#0aa5e8;stop-opacity:1"/>
      <stop offset=".164" style="stop-color:#0aa4e8;stop-opacity:1"/>
      <stop offset=".168" style="stop-color:#0aa4e8;stop-opacity:1"/>
      <stop offset=".172" style="stop-color:#0ba4e7;stop-opacity:1"/>
      <stop offset=".184" style="stop-color:#0ba4e7;stop-opacity:1"/>
      <stop offset=".188" style="stop-color:#0ba3e7;stop-opacity:1"/>
      <stop offset=".191" style="stop-color:#0ca3e6;stop-opacity:1"/>
      <stop offset=".203" style="stop-color:#0da2e6;stop-opacity:1"/>
      <stop offset=".215" style="stop-color:#0da2e6;stop-opacity:1"/>
      <stop offset=".219" style="stop-color:#0ea2e5;stop-opacity:1"/>
      <stop offset=".223" style="stop-color:#0ea1e5;stop-opacity:1"/>
      <stop offset=".227" style="stop-color:#0ea1e5;stop-opacity:1"/>
      <stop offset=".23" style="stop-color:#0ea1e5;stop-opacity:1"/>
      <stop offset=".234" style="stop-color:#0ea1e4;stop-opacity:1"/>
      <stop offset=".238" style="stop-color:#0fa0e4;stop-opacity:1"/>
      <stop offset=".25" style="stop-color:#10a0e4;stop-opacity:1"/>
      <stop offset=".254" style="stop-color:#10a0e3;stop-opacity:1"/>
      <stop offset=".262" style="stop-color:#109fe3;stop-opacity:1"/>
      <stop offset=".27" style="stop-color:#109fe3;stop-opacity:1"/>
      <stop offset=".273" style="stop-color:#119ee3;stop-opacity:1"/>
      <stop offset=".281" style="stop-color:#119ee2;stop-opacity:1"/>
      <stop offset=".289" style="stop-color:#129ee2;stop-opacity:1"/>
      <stop offset=".297" style="stop-color:#129de2;stop-opacity:1"/>
      <stop offset=".305" style="stop-color:#139de1;stop-opacity:1"/>
      <stop offset=".313" style="stop-color:#139ce1;stop-opacity:1"/>
      <stop offset=".32" style="stop-color:#149ce1;stop-opacity:1"/>
      <stop offset=".328" style="stop-color:#149ce0;stop-opacity:1"/>
      <stop offset=".332" style="stop-color:#149ce0;stop-opacity:1"/>
      <stop offset=".336" style="stop-color:#149be0;stop-opacity:1"/>
      <stop offset=".344" style="stop-color:#149adf;stop-opacity:1"/>
      <stop offset=".348" style="stop-color:#159adf;stop-opacity:1"/>
      <stop offset=".355" style="stop-color:#1699df;stop-opacity:1"/>
      <stop offset=".363" style="stop-color:#1699de;stop-opacity:1"/>
      <stop offset=".371" style="stop-color:#1799de;stop-opacity:1"/>
      <stop offset=".379" style="stop-color:#1798de;stop-opacity:1"/>
      <stop offset=".387" style="stop-color:#1798dd;stop-opacity:1"/>
      <stop offset=".395" style="stop-color:#1897dd;stop-opacity:1"/>
      <stop offset=".402" style="stop-color:#1897dd;stop-opacity:1"/>
      <stop offset=".41" style="stop-color:#1996dc;stop-opacity:1"/>
      <stop offset=".426" style="stop-color:#1995db;stop-opacity:1"/>
      <stop offset=".434" style="stop-color:#1a95db;stop-opacity:1"/>
      <stop offset=".438" style="stop-color:#1a95db;stop-opacity:1"/>
      <stop offset=".441" style="stop-color:#1b95db;stop-opacity:1"/>
      <stop offset=".449" style="stop-color:#1b94da;stop-opacity:1"/>
      <stop offset=".457" style="stop-color:#1c94da;stop-opacity:1"/>
      <stop offset=".465" style="stop-color:#1c93da;stop-opacity:1"/>
      <stop offset=".473" style="stop-color:#1c93d9;stop-opacity:1"/>
      <stop offset=".48" style="stop-color:#1d92d9;stop-opacity:1"/>
      <stop offset=".496" style="stop-color:#1d91d8;stop-opacity:1"/>
      <stop offset=".504" style="stop-color:#1e91d8;stop-opacity:1"/>
      <stop offset=".516" style="stop-color:#1f90d8;stop-opacity:1"/>
      <stop offset=".52" style="stop-color:#1f90d7;stop-opacity:1"/>
      <stop offset=".531" style="stop-color:#2090d7;stop-opacity:1"/>
      <stop offset=".535" style="stop-color:#208fd7;stop-opacity:1"/>
      <stop offset=".539" style="stop-color:#208fd6;stop-opacity:1"/>
      <stop offset=".543" style="stop-color:#208fd6;stop-opacity:1"/>
      <stop offset=".547" style="stop-color:#208fd6;stop-opacity:1"/>
      <stop offset=".551" style="stop-color:#208ed6;stop-opacity:1"/>
      <stop offset=".555" style="stop-color:#208ed6;stop-opacity:1"/>
      <stop offset=".559" style="stop-color:#218ed6;stop-opacity:1"/>
      <stop offset=".563" style="stop-color:#218ed5;stop-opacity:1"/>
      <stop offset=".566" style="stop-color:#218dd5;stop-opacity:1"/>
      <stop offset=".578" style="stop-color:#228cd5;stop-opacity:1"/>
      <stop offset=".582" style="stop-color:#228cd4;stop-opacity:1"/>
      <stop offset=".586" style="stop-color:#228cd4;stop-opacity:1"/>
      <stop offset=".59" style="stop-color:#228cd4;stop-opacity:1"/>
      <stop offset=".594" style="stop-color:#238cd4;stop-opacity:1"/>
      <stop offset=".598" style="stop-color:#238cd4;stop-opacity:1"/>
      <stop offset=".602" style="stop-color:#238bd4;stop-opacity:1"/>
      <stop offset=".605" style="stop-color:#248bd3;stop-opacity:1"/>
      <stop offset=".609" style="stop-color:#248bd3;stop-opacity:1"/>
      <stop offset=".613" style="stop-color:#248ad3;stop-opacity:1"/>
      <stop offset=".617" style="stop-color:#248ad3;stop-opacity:1"/>
      <stop offset=".621" style="stop-color:#248ad2;stop-opacity:1"/>
      <stop offset=".633" style="stop-color:#2589d2;stop-opacity:1"/>
      <stop offset=".641" style="stop-color:#2689d2;stop-opacity:1"/>
      <stop offset=".648" style="stop-color:#2688d1;stop-opacity:1"/>
      <stop offset=".656" style="stop-color:#2788d1;stop-opacity:1"/>
      <stop offset=".664" style="stop-color:#2787d1;stop-opacity:1"/>
      <stop offset=".672" style="stop-color:#2787d0;stop-opacity:1"/>
      <stop offset=".68" style="stop-color:#2886d0;stop-opacity:1"/>
      <stop offset=".688" style="stop-color:#2886d0;stop-opacity:1"/>
      <stop offset=".695" style="stop-color:#2985cf;stop-opacity:1"/>
      <stop offset=".711" style="stop-color:#2984ce;stop-opacity:1"/>
      <stop offset=".719" style="stop-color:#2a84ce;stop-opacity:1"/>
      <stop offset=".727" style="stop-color:#2a83ce;stop-opacity:1"/>
      <stop offset=".734" style="stop-color:#2b83cd;stop-opacity:1"/>
      <stop offset=".742" style="stop-color:#2b82cd;stop-opacity:1"/>
      <stop offset=".75" style="stop-color:#2c82cd;stop-opacity:1"/>
      <stop offset=".758" style="stop-color:#2c82cd;stop-opacity:1"/>
      <stop offset=".762" style="stop-color:#2c81cc;stop-opacity:1"/>
      <stop offset=".773" style="stop-color:#2d80cc;stop-opacity:1"/>
      <stop offset=".777" style="stop-color:#2d80cc;stop-opacity:1"/>
      <stop offset=".781" style="stop-color:#2d80cb;stop-opacity:1"/>
      <stop offset=".785" style="stop-color:#2d80cb;stop-opacity:1"/>
      <stop offset=".789" style="stop-color:#2d7fcb;stop-opacity:1"/>
      <stop offset=".793" style="stop-color:#2d7fcb;stop-opacity:1"/>
      <stop offset=".797" style="stop-color:#2e7fcb;stop-opacity:1"/>
      <stop offset=".801" style="stop-color:#2e7fcb;stop-opacity:1"/>
      <stop offset=".805" style="stop-color:#2e7fca;stop-opacity:1"/>
      <stop offset=".809" style="stop-color:#2e7eca;stop-opacity:1"/>
      <stop offset=".813" style="stop-color:#2f7eca;stop-opacity:1"/>
      <stop offset=".816" style="stop-color:#2f7dc9;stop-opacity:1"/>
      <stop offset=".824" style="stop-color:#307dc9;stop-opacity:1"/>
      <stop offset=".832" style="stop-color:#307cc9;stop-opacity:1"/>
      <stop offset=".84" style="stop-color:#307cc8;stop-opacity:1"/>
      <stop offset=".848" style="stop-color:#317cc8;stop-opacity:1"/>
      <stop offset=".852" style="stop-color:#317bc8;stop-opacity:1"/>
      <stop offset=".859" style="stop-color:#317bc8;stop-opacity:1"/>
      <stop offset=".867" style="stop-color:#327ac7;stop-opacity:1"/>
      <stop offset=".883" style="stop-color:#327ac7;stop-opacity:1"/>
      <stop offset=".887" style="stop-color:#3379c6;stop-opacity:1"/>
      <stop offset=".891" style="stop-color:#3379c6;stop-opacity:1"/>
      <stop offset=".895" style="stop-color:#3379c6;stop-opacity:1"/>
      <stop offset=".898" style="stop-color:#3479c5;stop-opacity:1"/>
      <stop offset=".91" style="stop-color:#3478c5;stop-opacity:1"/>
      <stop offset=".918" style="stop-color:#3577c5;stop-opacity:1"/>
      <stop offset=".926" style="stop-color:#3577c5;stop-opacity:1"/>
      <stop offset=".934" style="stop-color:#3576c4;stop-opacity:1"/>
      <stop offset=".941" style="stop-color:#3576c4;stop-opacity:1"/>
      <stop offset=".945" style="stop-color:#3575c4;stop-opacity:1"/>
      <stop offset=".949" style="stop-color:#3675c4;stop-opacity:1"/>
      <stop offset=".953" style="stop-color:#3675c4;stop-opacity:1"/>
      <stop offset=".957" style="stop-color:#3774c3;stop-opacity:1"/>
      <stop offset=".965" style="stop-color:#3774c3;stop-opacity:1"/>
      <stop offset=".973" style="stop-color:#3773c3;stop-opacity:1"/>
      <stop offset=".977" style="stop-color:#3873c2;stop-opacity:1"/>
      <stop offset=".98" style="stop-color:#3872c2;stop-opacity:1"/>
      <stop offset=".988" style="stop-color:#3872c2;stop-opacity:1"/>
      <stop offset=".992" style="stop-color:#3872c2;stop-opacity:1"/>
      <stop offset="1" style="stop-color:#3872c1;stop-opacity:1"/>
    </radialGradient>
  </defs>
  <g clip-path="url(#a)">
    <g clip-path="url(#b)">
      <g clip-path="url(#c)">
        <g clip-path="url(#d)">
          <path d="M417.14 147 110.868-53.008-73.09 227.867l306.274 200.008Zm0 0" style="stroke:none;fill-rule:nonzero;fill:url(#e)"/>
        </g>
      </g>
    </g>
  </g>
  <g clip-path="url(#f)">
    <g clip-path="url(#g)">
      <g clip-path="url(#h)">
        <g clip-path="url(#i)">
          <path d="M424.344 172.352 143.789-10.863-15.418 232.223l280.559 183.214Zm0 0" style="stroke:none;fill-rule:nonzero;fill:url(#j)"/>
        </g>
      </g>
    </g>
  </g>
  <g style="fill:#004aad;fill-opacity:1">
    <path d="M6.422.234c-1 0-1.883-.234-2.64-.703C3.02-.945 2.425-1.664 2-2.625c-.43-.957-.64-2.14-.64-3.547 0-1.414.222-2.601.671-3.562.446-.97 1.063-1.688 1.844-2.157.79-.476 1.707-.718 2.75-.718.82 0 1.563.156 2.219.468.656.313 1.222.825 1.703 1.532l.234-.047v-6.688h1.828V0h-1.828v-1.813l-.234-.03c-.406.605-.961 1.105-1.656 1.5-.688.382-1.512.577-2.47.577Zm.562-1.64c1.157 0 2.079-.39 2.766-1.172.688-.79 1.031-1.988 1.031-3.594 0-1.625-.344-2.828-1.031-3.61-.688-.788-1.61-1.187-2.766-1.187-1.187 0-2.105.387-2.75 1.156-.636.774-.953 1.985-.953 3.641 0 3.18 1.235 4.766 3.703 4.766Zm0 0" style="stroke:none" transform="translate(22.725 209.952)"/>
  </g>
</svg>

`.trim();

const UtilixyLogo: React.FC<UtilixyLogoProps> = ({
  width = 32,
  height = 32,
  className = "block",
  title = "Utilixy logo",
  decorative = false,
  style,
  loading = "eager",            // default: brand should load immediately
}) => {
  const src = React.useMemo(
    () => "data:image/svg+xml;utf8," + encodeURIComponent(RAW_SVG),
    []
  );

  return (
    <img
      src={src}
      width={width}
      height={height}
      className={className}
      style={style}
      alt={decorative ? "" : title}
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : "img"}
      decoding="async"
      loading={loading}
    />
  );
};

export default UtilixyLogo;