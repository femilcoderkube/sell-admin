import { getColor, getSmile } from "./matchCards";

export const mobileViewCard_one = ({ player }) => (
  <svg
    width={345}
    height={92}
    viewBox="0 0 345 92"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <foreignObject x={-48} y={-48} width={438} height={188}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          //backdropFilter: "blur(24px)",
          clipPath: "url(#bgblur_0_3264_14073_clip_path)",
          height: "100%",
          width: "100%",
        }}
      />
    </foreignObject>
    <path
      data-figma-bg-blur-radius={48}
      d="M342 8V84L330 92H222L218 88H124L120 92H12L0 84V8L12 0H330L342 8Z"
      fill="url(#paint0_linear_3264_14073)"
    />
    <mask
      id="mask0_3264_14073"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={342}
      height={92}
    >
      <path
        d="M342 8V84L330 92H222L218 88H124L120 92H12L0 84V8L12 0H330L342 8Z"
        fill="url(#paint1_linear_3264_14073)"
      />
    </mask>
    <g mask="url(#mask0_3264_14073)">
      <g
        style={{
          mixBlendMode: "luminosity",
        }}
      >
        <path
          d="M175 8L213 46L175 84L137 46L175 8Z"
          fill="url(#paint2_linear_3264_14073)"
          fillOpacity={0.32}
        />
        <path
          d="M212.152 46L175 83.1523L137.848 46L175 8.84766L212.152 46Z"
          stroke="url(#paint3_linear_3264_14073)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M175 -72L213 -34L175 4L137 -34L175 -72Z"
          fill="url(#paint4_linear_3264_14073)"
          fillOpacity={0.48}
        />
        <path
          d="M212.152 -34L175 3.15234L137.848 -34L175 -71.1523L212.152 -34Z"
          stroke="url(#paint5_linear_3264_14073)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M135 48L173 86L135 124L97 86L135 48Z"
          fill="url(#paint6_linear_3264_14073)"
          fillOpacity={0.48}
        />
        <path
          d="M172.152 86L135 123.152L97.8477 86L135 48.8477L172.152 86Z"
          stroke="url(#paint7_linear_3264_14073)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M135 -32L173 6L135 44L99 6L135 -32Z"
          fill="url(#paint8_linear_3264_14073)"
          fillOpacity={0.48}
        />
        <path
          d="M172.152 6L135.012 43.1396L99.8262 6L135.012 -31.1406L172.152 6Z"
          stroke="url(#paint9_linear_3264_14073)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M255 8L293 46L255 84L217 46L255 8Z"
          fill="url(#paint10_linear_3264_14073)"
          fillOpacity={0.24}
        />
        <path
          d="M292.152 46L255 83.1523L217.848 46L255 8.84766L292.152 46Z"
          stroke="url(#paint11_linear_3264_14073)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M255 -72L291 -34L255 4L217 -34L255 -72Z"
          fill="url(#paint12_linear_3264_14073)"
          fillOpacity={0.48}
        />
        <path
          d="M290.173 -34L254.987 3.13965L217.848 -34L254.987 -71.1406L290.173 -34Z"
          stroke="url(#paint13_linear_3264_14073)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M333 -72L369 -34L333 4L295 -34L333 -72Z"
          fill="url(#paint14_linear_3264_14073)"
          fillOpacity={0.48}
        />
        <path
          d="M368.173 -34L332.987 3.13965L295.848 -34L332.987 -71.1406L368.173 -34Z"
          stroke="url(#paint15_linear_3264_14073)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M215 50L253 86L215 124L177 86L215 50Z"
          fill="url(#paint16_linear_3264_14073)"
          fillOpacity={0.48}
        />
        <path
          d="M252.14 86.0117L215 123.152L177.859 86.0117L215 50.8262L252.14 86.0117Z"
          stroke="url(#paint17_linear_3264_14073)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M215 -32L251 6L215 44L179 6L215 -32Z"
          fill="url(#paint18_linear_3264_14073)"
          fillOpacity={0.48}
        />
        <path
          d="M250.173 6L215 43.127L179.826 6L215 -31.1279L250.173 6Z"
          stroke="url(#paint19_linear_3264_14073)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M15 8L53 46L15 84L-21 46L15 8Z"
          fill="url(#paint20_linear_3264_14073)"
          fillOpacity={0.64}
        />
        <path
          d="M52.1523 46L15.0117 83.1396L-20.1738 46L15.0117 8.85938L52.1523 46Z"
          stroke="url(#paint21_linear_3264_14073)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M335 8L373 46L335 84L297 46L335 8Z"
          fill="url(#paint22_linear_3264_14073)"
          fillOpacity={0.64}
        />
        <path
          d="M372.152 46L335 83.1523L297.848 46L335 8.84766L372.152 46Z"
          stroke="url(#paint23_linear_3264_14073)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M295 48L333 86L295 124L257 86L295 48Z"
          fill="url(#paint24_linear_3264_14073)"
          fillOpacity={0.48}
        />
        <path
          d="M332.152 86L295 123.152L257.848 86L295 48.8477L332.152 86Z"
          stroke="url(#paint25_linear_3264_14073)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M295 -32L333 6L293 42L257 6L295 -32Z"
          fill="url(#paint26_linear_3264_14073)"
          fillOpacity={0.48}
        />
        <path
          d="M332.128 5.97559L293.021 41.1729L257.848 6L295 -31.1523L332.128 5.97559Z"
          stroke="url(#paint27_linear_3264_14073)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M373 -32L411 6L371 42L335 6L373 -32Z"
          fill="url(#paint28_linear_3264_14073)"
          fillOpacity={0.64}
        />
        <path
          d="M410.128 5.97559L371.021 41.1729L335.848 6L373 -31.1523L410.128 5.97559Z"
          stroke="url(#paint29_linear_3264_14073)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M95 8L133 46L95 84L57 46L95 8Z"
          fill="url(#paint30_linear_3264_14073)"
          fillOpacity={0.48}
        />
        <path
          d="M132.152 46L95 83.1523L57.8477 46L95 8.84766L132.152 46Z"
          stroke="url(#paint31_linear_3264_14073)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M95 -72L133 -34L95 2L57 -34L95 -72Z"
          fill="url(#paint32_linear_3264_14073)"
          fillOpacity={0.48}
        />
        <path
          d="M132.14 -34.0127L95 1.17285L57.8594 -34.0127L95 -71.1523L132.14 -34.0127Z"
          stroke="url(#paint33_linear_3264_14073)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M13 -72L51 -34L13 2L-25 -34L13 -72Z"
          fill="url(#paint34_linear_3264_14073)"
          fillOpacity={0.48}
        />
        <path
          d="M50.1396 -34.0127L13 1.17285L-24.1406 -34.0127L13 -71.1523L50.1396 -34.0127Z"
          stroke="url(#paint35_linear_3264_14073)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M55 48L91 86L55 124L17 86L55 48Z"
          fill="url(#paint36_linear_3264_14073)"
          fillOpacity={0.48}
        />
        <path
          d="M90.1729 86L54.9873 123.14L17.8477 86L54.9873 48.8594L90.1729 86Z"
          stroke="url(#paint37_linear_3264_14073)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M55 -32L93 6L57 42L17 6L55 -32Z"
          fill="url(#paint38_linear_3264_14073)"
          fillOpacity={0.48}
        />
        <path
          d="M92.1523 6L56.9785 41.1729L17.8711 5.97559L55 -31.1523L92.1523 6Z"
          stroke="url(#paint39_linear_3264_14073)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M-27 -32L11 6L-25 42L-65 6L-27 -32Z"
          fill="url(#paint40_linear_3264_14073)"
          fillOpacity={0.48}
        />
        <path
          d="M10.1523 6L-25.0215 41.1729L-64.1289 5.97559L-27 -31.1523L10.1523 6Z"
          stroke="url(#paint41_linear_3264_14073)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
      </g>
    </g>
    <g filter="url(#filter1_i_3264_14073)">
      <path
        d="M342 8V84L330 92H222L218 88H124L120 92H12L0 84V8L12 0H330L342 8Z"
        fill="url(#paint42_linear_3264_14073)"
        fillOpacity={0.08}
      />
    </g>
    <path
      d="M329.849 0.5L341.5 8.26758V83.7324L329.849 91.5H222.207L218.207 87.5H123.793L119.793 91.5H12.1514L0.5 83.7324V8.26758L12.1514 0.5H329.849Z"
      stroke="url(#paint43_linear_3264_14073)"
    />
    <path
      d="M210 24H341V68H210V24Z"
      fill="url(#paint44_linear_3264_14073)"
      fillOpacity={0.6}
    />
    <text
      fill="#F4F7FF"
      xmlSpace="preserve"
      style={{
        whiteSpace: "pre",
      }}
      fontFamily="Cairo"
      fontSize={16}
      fontWeight="bold"
      letterSpacing="0em"
    >
      <tspan x={92} y={39.856}>
        {player.gameID}
      </tspan>
    </text>
    <text
      fill="#FFD0AF"
      xmlSpace="preserve"
      style={{
        whiteSpace: "pre",
      }}
      fontFamily="Cairo"
      fontSize={14}
      fontWeight={500}
      letterSpacing="0em"
    >
      <tspan x={92} y={65.124}>
        {`@${player.username}`}
      </tspan>
    </text>
    <path
      d="M24 12C28.5508 12 32.5097 14.5334 34.5439 18.2666C38.0739 16.8068 41.9426 16 46 16C62.5685 16 76 29.4315 76 46C76 62.5685 62.5685 76 46 76C29.4315 76 16 62.5685 16 46C16 41.9426 16.8068 38.0739 18.2666 34.5439C14.5334 32.5097 12 28.5508 12 24C12 17.3726 17.3726 12 24 12Z"
      fill="url(#paint45_radial_3264_14073)"
      fillOpacity={0.6}
    />
    <g filter="url(#filter2_d_3264_14073)">
      <path
        d="M46 22C59.2548 22 70 32.7452 70 46C70 59.2548 59.2548 70 46 70C32.7452 70 22 59.2548 22 46C22 42.43 22.7797 39.0421 24.1777 35.9971C30.664 35.9029 35.9029 30.664 35.9971 24.1777C39.0421 22.7797 42.43 22 46 22Z"
        fill={`url(#pattern0_3264_14073${player.index})`}
        shapeRendering="crispEdges"
      />
    </g>
    <mask
      id="mask1_3264_14073"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={16}
      y={16}
      width={16}
      height={16}
    >
      <rect
        x={16}
        y={16}
        width={16}
        height={16}
        fill="url(#pattern1_3264_14073)"
      />
    </mask>
    <g mask="url(#mask1_3264_14073)">
      <rect x={16} y={16} width={16} height={16} fill={getColor(player.rep)} />
    </g>
    
      <text
         fill="#fff"
        xmlSpace="preserve"
        style={{
          whiteSpace: "pre",
        }}
        textAnchor="end"
        fontFamily="Cairo"
        fontSize={22}
        fontWeight="bold"
        letterSpacing="0em"
      >
        <tspan x={320} y={52.052}>
          {player.score}
        </tspan>
      </text>
    
    <defs>
      <clipPath id="bgblur_0_3264_14073_clip_path" transform="translate(48 48)">
        <path d="M342 8V84L330 92H222L218 88H124L120 92H12L0 84V8L12 0H330L342 8Z" />
      </clipPath>
      <filter
        id="filter1_i_3264_14073"
        x={0}
        y={0}
        width={346}
        height={92}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx={4} />
        <feGaussianBlur stdDeviation={6} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.0540465 0 0 0 0 0.0114183 0 0 0 0 0.0913462 0 0 0 0.4 0"
        />
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_3264_14073"
        />
      </filter>
      <filter
        id="filter2_d_3264_14073"
        x={20}
        y={22}
        width={52}
        height={52}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={2} />
        <feGaussianBlur stdDeviation={1} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0.00392157 0 0 0 0 0.0235294 0 0 0 0.24 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3264_14073"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_3264_14073"
          result="shape"
        />
      </filter>
      <pattern
        id={`pattern0_3264_14073${player.index}`}
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <use xlinkHref={`#image0_3264_14073${player.index}`} transform="scale(0.0013587)" />
      </pattern>
      <pattern
        id="pattern1_3264_14073"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <use xlinkHref="#image1_3264_14073" transform="scale(0.0078125)" />
      </pattern>
      <filter
        id="filter3_d_3264_14073"
        x={221.106}
        y={17.216}
        width={123.559}
        height={63.026}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={12} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.673077 0 0 0 0 0.343556 0 0 0 0 0.11973 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3264_14073"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_3264_14073"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_3264_14073"
        x1={0}
        y1={46}
        x2={342}
        y2={46}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#BC5225" />
        <stop offset={1} stopColor="#F49528" stopOpacity={0.6} />
      </linearGradient>
      <linearGradient
        id="paint1_linear_3264_14073"
        x1={0}
        y1={46}
        x2={342}
        y2={46}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#D9D9D9" stopOpacity={0.6} />
        <stop offset={1} stopColor="#D9D9D9" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_3264_14073"
        x1={123.25}
        y1={101.459}
        x2={105.725}
        y2={-12.2986}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint3_linear_3264_14073"
        x1={145.73}
        y1={0.999999}
        x2={158.197}
        y2={58.6633}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint4_linear_3264_14073"
        x1={147.25}
        y1={-46.75}
        x2={256}
        y2={-77}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" stopOpacity={0} />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint5_linear_3264_14073"
        x1={196.75}
        y1={-72}
        x2={173}
        y2={-24.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint6_linear_3264_14073"
        x1={97}
        y1={103}
        x2={63.1327}
        y2={27.3397}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" stopOpacity={0} />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint7_linear_3264_14073"
        x1={105.73}
        y1={41}
        x2={118.197}
        y2={98.6633}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint8_linear_3264_14073"
        x1={108.98}
        y1={-6.75}
        x2={215.265}
        y2={-35.5362}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" stopOpacity={0} />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint9_linear_3264_14073"
        x1={157.178}
        y1={-32}
        x2={133.05}
        y2={14.9852}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint10_linear_3264_14073"
        x1={227.25}
        y1={33.25}
        x2={336}
        y2={3}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint11_linear_3264_14073"
        x1={276.75}
        y1={8}
        x2={253}
        y2={55.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint12_linear_3264_14073"
        x1={226.98}
        y1={-46.75}
        x2={333.265}
        y2={-75.5362}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" stopOpacity={0} />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint13_linear_3264_14073"
        x1={275.178}
        y1={-72}
        x2={251.05}
        y2={-25.0148}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint14_linear_3264_14073"
        x1={304.98}
        y1={-46.75}
        x2={411.265}
        y2={-75.5362}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" stopOpacity={0} />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint15_linear_3264_14073"
        x1={353.178}
        y1={-72}
        x2={329.05}
        y2={-25.0148}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint16_linear_3264_14073"
        x1={177}
        y1={103.553}
        x2={144.611}
        y2={29.2391}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" stopOpacity={0} />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint17_linear_3264_14073"
        x1={185.73}
        y1={43.1842}
        x2={197.577}
        y2={99.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint18_linear_3264_14073"
        x1={188.711}
        y1={-6.75}
        x2={292.501}
        y2={-34.1009}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" stopOpacity={0} />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint19_linear_3264_14073"
        x1={235.605}
        y1={-32}
        x2={211.096}
        y2={14.4393}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint20_linear_3264_14073"
        x1={-21}
        y1={63}
        x2={-55.4674}
        y2={-11.9747}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" stopOpacity={0} />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint21_linear_3264_14073"
        x1={-12.5}
        y1={0.999999}
        x2={0.272636}
        y2={58.5225}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint22_linear_3264_14073"
        x1={307.25}
        y1={33.25}
        x2={416}
        y2={3}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" stopOpacity={0} />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint23_linear_3264_14073"
        x1={356.75}
        y1={8}
        x2={333}
        y2={55.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint24_linear_3264_14073"
        x1={257}
        y1={103}
        x2={223.133}
        y2={27.3397}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" stopOpacity={0} />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint25_linear_3264_14073"
        x1={265.73}
        y1={41}
        x2={278.197}
        y2={98.6633}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint26_linear_3264_14073"
        x1={243.25}
        y1={59}
        x2={226.615}
        y2={-51.898}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" stopOpacity={0} />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint27_linear_3264_14073"
        x1={265.73}
        y1={-38.8158}
        x2={277.577}
        y2={17.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint28_linear_3264_14073"
        x1={335}
        y1={21.5526}
        x2={302.611}
        y2={-52.7609}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" stopOpacity={0} />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint29_linear_3264_14073"
        x1={343.73}
        y1={-38.8158}
        x2={355.577}
        y2={17.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint30_linear_3264_14073"
        x1={67.25}
        y1={33.25}
        x2={176}
        y2={3}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" stopOpacity={0} />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint31_linear_3264_14073"
        x1={116.75}
        y1={8}
        x2={93}
        y2={55.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint32_linear_3264_14073"
        x1={43.25}
        y1={19}
        x2={26.6148}
        y2={-91.898}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" stopOpacity={0} />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint33_linear_3264_14073"
        x1={65.7297}
        y1={-78.8158}
        x2={77.5766}
        y2={-22.5395}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint34_linear_3264_14073"
        x1={-38.75}
        y1={19}
        x2={-55.3852}
        y2={-91.898}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" stopOpacity={0} />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint35_linear_3264_14073"
        x1={-16.2703}
        y1={-78.8158}
        x2={-4.42337}
        y2={-22.5395}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint36_linear_3264_14073"
        x1={26.9803}
        y1={73.25}
        x2={133.265}
        y2={44.4638}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" stopOpacity={0} />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint37_linear_3264_14073"
        x1={75.1776}
        y1={48}
        x2={51.0501}
        y2={94.9852}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint38_linear_3264_14073"
        x1={17}
        y1={21.5526}
        x2={-15.3891}
        y2={-52.7609}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" stopOpacity={0} />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint39_linear_3264_14073"
        x1={25.7297}
        y1={-38.8158}
        x2={37.5766}
        y2={17.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint40_linear_3264_14073"
        x1={-65}
        y1={21.5526}
        x2={-97.3891}
        y2={-52.7609}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" stopOpacity={0} />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint41_linear_3264_14073"
        x1={-56.2703}
        y1={-38.8158}
        x2={-44.4234}
        y2={17.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9C55" />
        <stop offset={1} stopColor="#FF9C55" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint42_linear_3264_14073"
        x1={0}
        y1={46}
        x2={342}
        y2={46}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#BC5225" />
        <stop offset={1} stopColor="#F49528" stopOpacity={0.6} />
      </linearGradient>
      <linearGradient
        id="paint43_linear_3264_14073"
        x1={0}
        y1={46}
        x2={342}
        y2={46}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFAC89" />
        <stop offset={0.475527} stopColor="#FFAC89" stopOpacity={0} />
        <stop offset={1} stopColor="#FFA843" stopOpacity={0.6} />
      </linearGradient>
      <linearGradient
        id="paint44_linear_3264_14073"
        x1={210}
        y1={45.5892}
        x2={324.943}
        y2={46.2876}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFBB6D" stopOpacity={0} />
        <stop offset={1} stopColor="#FFBB6D" stopOpacity={0.4} />
      </linearGradient>
      <radialGradient
        id="paint45_radial_3264_14073"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(48 48) rotate(90) scale(38 38)"
      >
        <stop offset={0.319715} stopColor="#0D0D28" stopOpacity={0} />
        <stop offset={1} stopColor="#0D0D28" />
      </radialGradient>
      <linearGradient
        id="paint46_linear_3264_14073"
        x1={282.536}
        y1={32}
        x2={282.345}
        y2={55.9991}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.601585} stopColor="#FFEADB" />
        <stop offset={0.923372} stopColor="#FFD0AF" />
      </linearGradient>
      <image
      //{`image0_3264_14073${player.index}`}}
        // id="image0_3264_14073"
        id={`image0_3264_14073${player.index}`}
        width={736}
        height={736}
        preserveAspectRatio="none"
        xlinkHref={player.profilePic}
      />
      <image
        id="image1_3264_14073"
        width={128}
        height={128}
        preserveAspectRatio="none"
        xlinkHref={getSmile(player.rep)}
      />
    </defs>
  </svg>
);
export const mobileViewCard_two = ({ player }) => (
  <svg
    width={343}
    height={100}
    viewBox="0 0 343 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <foreignObject x={-48} y={-48} width={438} height={196}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          //backdropFilter: "blur(24px)",
          clipPath: "url(#bgblur_0_3264_14144_clip_path)",
          height: "100%",
          width: "100%",
        }}
      />
    </foreignObject>
    <path
      data-figma-bg-blur-radius={48}
      d="M214 100H128L124 96H12L0 88V12L12 4H124L128 0H214L218 4H330L342 12V88L330 96H218L214 100Z"
      fill="url(#paint0_linear_3264_14144)"
      fillOpacity={0.4}
    />
    <mask
      id="mask0_3264_14144"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={342}
      height={100}
    >
      <path
        d="M214 100H128L124 96H12L0 88V12L12 4H124L128 0H214L218 4H330L342 12V88L330 96H218L214 100Z"
        fill="url(#paint1_linear_3264_14144)"
      />
    </mask>
    <g mask="url(#mask0_3264_14144)">
      <g
        style={{
          mixBlendMode: "luminosity",
        }}
      >
        <path
          d="M175 8L213 46L175 84L137 46L175 8Z"
          fill="url(#paint2_linear_3264_14144)"
          fillOpacity={0.32}
        />
        <path
          d="M212.152 46L175 83.1523L137.848 46L175 8.84766L212.152 46Z"
          stroke="url(#paint3_linear_3264_14144)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M175 -72L213 -34L175 4L137 -34L175 -72Z"
          fill="url(#paint4_linear_3264_14144)"
          fillOpacity={0.48}
        />
        <path
          d="M212.152 -34L175 3.15234L137.848 -34L175 -71.1523L212.152 -34Z"
          stroke="url(#paint5_linear_3264_14144)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M135 48L173 86L135 124L97 86L135 48Z"
          fill="url(#paint6_linear_3264_14144)"
          fillOpacity={0.48}
        />
        <path
          d="M172.152 86L135 123.152L97.8477 86L135 48.8477L172.152 86Z"
          stroke="url(#paint7_linear_3264_14144)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M135 -32L173 6L135 44L99 6L135 -32Z"
          fill="url(#paint8_linear_3264_14144)"
          fillOpacity={0.48}
        />
        <path
          d="M172.152 6L135.012 43.1396L99.8262 6L135.012 -31.1406L172.152 6Z"
          stroke="url(#paint9_linear_3264_14144)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M255 8L293 46L255 84L217 46L255 8Z"
          fill="url(#paint10_linear_3264_14144)"
          fillOpacity={0.24}
        />
        <path
          d="M292.152 46L255 83.1523L217.848 46L255 8.84766L292.152 46Z"
          stroke="url(#paint11_linear_3264_14144)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M255 -72L291 -34L255 4L217 -34L255 -72Z"
          fill="url(#paint12_linear_3264_14144)"
          fillOpacity={0.48}
        />
        <path
          d="M290.173 -34L254.987 3.13965L217.848 -34L254.987 -71.1406L290.173 -34Z"
          stroke="url(#paint13_linear_3264_14144)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M333 -72L369 -34L333 4L295 -34L333 -72Z"
          fill="url(#paint14_linear_3264_14144)"
          fillOpacity={0.48}
        />
        <path
          d="M368.173 -34L332.987 3.13965L295.848 -34L332.987 -71.1406L368.173 -34Z"
          stroke="url(#paint15_linear_3264_14144)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M215 50L253 86L215 124L177 86L215 50Z"
          fill="url(#paint16_linear_3264_14144)"
          fillOpacity={0.48}
        />
        <path
          d="M252.14 86.0117L215 123.152L177.859 86.0117L215 50.8262L252.14 86.0117Z"
          stroke="url(#paint17_linear_3264_14144)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M215 -32L251 6L215 44L179 6L215 -32Z"
          fill="url(#paint18_linear_3264_14144)"
          fillOpacity={0.48}
        />
        <path
          d="M250.173 6L215 43.127L179.826 6L215 -31.1279L250.173 6Z"
          stroke="url(#paint19_linear_3264_14144)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M15 8L53 46L15 84L-21 46L15 8Z"
          fill="url(#paint20_linear_3264_14144)"
          fillOpacity={0.64}
        />
        <path
          d="M52.1523 46L15.0117 83.1396L-20.1738 46L15.0117 8.85938L52.1523 46Z"
          stroke="url(#paint21_linear_3264_14144)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M335 8L373 46L335 84L297 46L335 8Z"
          fill="url(#paint22_linear_3264_14144)"
          fillOpacity={0.64}
        />
        <path
          d="M372.152 46L335 83.1523L297.848 46L335 8.84766L372.152 46Z"
          stroke="url(#paint23_linear_3264_14144)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M295 48L333 86L295 124L257 86L295 48Z"
          fill="url(#paint24_linear_3264_14144)"
          fillOpacity={0.48}
        />
        <path
          d="M332.152 86L295 123.152L257.848 86L295 48.8477L332.152 86Z"
          stroke="url(#paint25_linear_3264_14144)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M295 -32L333 6L293 42L257 6L295 -32Z"
          fill="url(#paint26_linear_3264_14144)"
          fillOpacity={0.48}
        />
        <path
          d="M332.128 5.97559L293.021 41.1729L257.848 6L295 -31.1523L332.128 5.97559Z"
          stroke="url(#paint27_linear_3264_14144)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M373 -32L411 6L371 42L335 6L373 -32Z"
          fill="url(#paint28_linear_3264_14144)"
          fillOpacity={0.64}
        />
        <path
          d="M410.128 5.97559L371.021 41.1729L335.848 6L373 -31.1523L410.128 5.97559Z"
          stroke="url(#paint29_linear_3264_14144)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M95 8L133 46L95 84L57 46L95 8Z"
          fill="url(#paint30_linear_3264_14144)"
          fillOpacity={0.48}
        />
        <path
          d="M132.152 46L95 83.1523L57.8477 46L95 8.84766L132.152 46Z"
          stroke="url(#paint31_linear_3264_14144)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M95 -72L133 -34L95 2L57 -34L95 -72Z"
          fill="url(#paint32_linear_3264_14144)"
          fillOpacity={0.48}
        />
        <path
          d="M132.14 -34.0127L95 1.17285L57.8594 -34.0127L95 -71.1523L132.14 -34.0127Z"
          stroke="url(#paint33_linear_3264_14144)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M13 -72L51 -34L13 2L-25 -34L13 -72Z"
          fill="url(#paint34_linear_3264_14144)"
          fillOpacity={0.48}
        />
        <path
          d="M50.1396 -34.0127L13 1.17285L-24.1406 -34.0127L13 -71.1523L50.1396 -34.0127Z"
          stroke="url(#paint35_linear_3264_14144)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M55 48L91 86L55 124L17 86L55 48Z"
          fill="url(#paint36_linear_3264_14144)"
          fillOpacity={0.48}
        />
        <path
          d="M90.1729 86L54.9873 123.14L17.8477 86L54.9873 48.8594L90.1729 86Z"
          stroke="url(#paint37_linear_3264_14144)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M55 -32L93 6L57 42L17 6L55 -32Z"
          fill="url(#paint38_linear_3264_14144)"
          fillOpacity={0.48}
        />
        <path
          d="M92.1523 6L56.9785 41.1729L17.8711 5.97559L55 -31.1523L92.1523 6Z"
          stroke="url(#paint39_linear_3264_14144)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M-27 -32L11 6L-25 42L-65 6L-27 -32Z"
          fill="url(#paint40_linear_3264_14144)"
          fillOpacity={0.48}
        />
        <path
          d="M10.1523 6L-25.0215 41.1729L-64.1289 5.97559L-27 -31.1523L10.1523 6Z"
          stroke="url(#paint41_linear_3264_14144)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
      </g>
    </g>
    <g filter="url(#filter1_i_3264_14144)">
      <path
        d="M214 100H128L124 96H12L0 88V12L12 4H124L128 0H214L218 4H330L342 12V88L330 96H218L214 100Z"
        fill="url(#paint42_linear_3264_14144)"
        fillOpacity={0.08}
      />
    </g>
    <path
      d="M213.793 0.5L217.793 4.5H329.849L341.5 12.2676V87.7324L329.849 95.5H217.793L213.793 99.5H128.207L124.207 95.5H12.1514L0.5 87.7324V12.2676L12.1514 4.5H124.207L128.207 0.5H213.793Z"
      stroke="url(#paint43_linear_3264_14144)"
    />
    <path
      d="M210 28H341V72H210V28Z"
      fill="url(#paint44_linear_3264_14144)"
      fillOpacity={0.6}
    />
    <text
      fill="#F4F7FF"
      xmlSpace="preserve"
      style={{
        whiteSpace: "pre",
      }}
      fontFamily="Cairo"
      fontSize={16}
      fontWeight="bold"
      letterSpacing="0em"
    >
      <tspan x={92} y={43.856}>
        {player.gameID}
      </tspan>
    </text>
    <text
      fill="#8598F6"
      xmlSpace="preserve"
      style={{
        whiteSpace: "pre",
      }}
      fontFamily="Cairo"
      fontSize={14}
      fontWeight={500}
      letterSpacing="0em"
    >
      <tspan x={92} y={69.124}>
        {`@${player.username}`}
      </tspan>
    </text>
    <path
      d="M24 16C28.5508 16 32.5097 18.5334 34.5439 22.2666C38.0739 20.8068 41.9426 20 46 20C62.5685 20 76 33.4315 76 50C76 66.5685 62.5685 80 46 80C29.4315 80 16 66.5685 16 50C16 45.9426 16.8068 42.0739 18.2666 38.5439C14.5334 36.5097 12 32.5508 12 28C12 21.3726 17.3726 16 24 16Z"
      fill="url(#paint45_radial_3264_14144)"
      fillOpacity={0.6}
    />
    <g filter="url(#filter2_d_3264_14144)">
      <path
        d="M46 26C59.2548 26 70 36.7452 70 50C70 63.2548 59.2548 74 46 74C32.7452 74 22 63.2548 22 50C22 46.43 22.7797 43.0421 24.1777 39.9971C30.664 39.9029 35.9029 34.664 35.9971 28.1777C39.0421 26.7797 42.43 26 46 26Z"
        fill={`url(#pattern0_3264_14144${player.index})`}
        shapeRendering="crispEdges"
      />
    </g>
    <mask
      id="mask1_3264_14144"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={16}
      y={20}
      width={16}
      height={16}
    >
      <rect
        x={16}
        y={20}
        width={16}
        height={16}
        fill="url(#pattern1_3264_14144)"
      />
    </mask>
    <g mask="url(#mask1_3264_14144)">
      <rect x={16} y={20} width={16} height={16} fill={getColor(player.rep)} />
    </g>
    
      <text
        fill="#fff"
        xmlSpace="preserve"
        style={{
          whiteSpace: "pre",
        }}
        textAnchor="end"
        fontFamily="Cairo"
        fontSize={22}
        fontWeight="bold"
        letterSpacing="0em"
      >
        <tspan x={320} y={56.052}>
          {player.score}
        </tspan>
      </text>
    
    <defs>
      <clipPath id="bgblur_0_3264_14144_clip_path" transform="translate(48 48)">
        <path d="M214 100H128L124 96H12L0 88V12L12 4H124L128 0H214L218 4H330L342 12V88L330 96H218L214 100Z" />
      </clipPath>
      <filter
        id="filter1_i_3264_14144"
        x={0}
        y={0}
        width={346}
        height={100}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx={4} />
        <feGaussianBlur stdDeviation={6} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.0114183 0 0 0 0 0.0237149 0 0 0 0 0.0913462 0 0 0 0.4 0"
        />
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_3264_14144"
        />
      </filter>
      <filter
        id="filter2_d_3264_14144"
        x={20}
        y={26}
        width={52}
        height={52}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={2} />
        <feGaussianBlur stdDeviation={1} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0.00392157 0 0 0 0 0.0235294 0 0 0 0.24 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3264_14144"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_3264_14144"
          result="shape"
        />
      </filter>
      <pattern
        id={`pattern0_3264_14144${player.index}`}
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <use
          xlinkHref={`#image0_3264_14144${player.index}`}
          transform="translate(0 -0.0503401) scale(0.00136054)"
        />
      </pattern>
      <pattern
        id="pattern1_3264_14144"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <use xlinkHref="#image1_3264_14144" transform="scale(0.0078125)" />
      </pattern>
      <filter
        id="filter3_d_3264_14144"
        x={221.106}
        y={21.216}
        width={121.887}
        height={63.026}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={12} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.0117647 0 0 0 0 0.0235294 0 0 0 0 0.0901961 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3264_14144"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_3264_14144"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_3264_14144"
        x1={0}
        y1={50}
        x2={342}
        y2={50}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2743DD" />
        <stop offset={1} stopColor="#3A4EBF" stopOpacity={0.4} />
      </linearGradient>
      <linearGradient
        id="paint1_linear_3264_14144"
        x1={0}
        y1={50}
        x2={342}
        y2={50}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#D9D9D9" stopOpacity={0.2} />
        <stop offset={1} stopColor="#D9D9D9" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_3264_14144"
        x1={123.25}
        y1={101.459}
        x2={105.725}
        y2={-12.2986}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint3_linear_3264_14144"
        x1={145.73}
        y1={0.999999}
        x2={158.197}
        y2={58.6633}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint4_linear_3264_14144"
        x1={147.25}
        y1={-46.75}
        x2={256}
        y2={-77}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint5_linear_3264_14144"
        x1={196.75}
        y1={-72}
        x2={173}
        y2={-24.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint6_linear_3264_14144"
        x1={97}
        y1={103}
        x2={63.1327}
        y2={27.3397}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint7_linear_3264_14144"
        x1={105.73}
        y1={41}
        x2={118.197}
        y2={98.6633}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint8_linear_3264_14144"
        x1={108.98}
        y1={-6.75}
        x2={215.265}
        y2={-35.5362}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint9_linear_3264_14144"
        x1={157.178}
        y1={-32}
        x2={133.05}
        y2={14.9852}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint10_linear_3264_14144"
        x1={227.25}
        y1={33.25}
        x2={336}
        y2={3}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint11_linear_3264_14144"
        x1={276.75}
        y1={8}
        x2={253}
        y2={55.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint12_linear_3264_14144"
        x1={226.98}
        y1={-46.75}
        x2={333.265}
        y2={-75.5362}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint13_linear_3264_14144"
        x1={275.178}
        y1={-72}
        x2={251.05}
        y2={-25.0148}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint14_linear_3264_14144"
        x1={304.98}
        y1={-46.75}
        x2={411.265}
        y2={-75.5362}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint15_linear_3264_14144"
        x1={353.178}
        y1={-72}
        x2={329.05}
        y2={-25.0148}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint16_linear_3264_14144"
        x1={177}
        y1={103.553}
        x2={144.611}
        y2={29.2391}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint17_linear_3264_14144"
        x1={185.73}
        y1={43.1842}
        x2={197.577}
        y2={99.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint18_linear_3264_14144"
        x1={188.711}
        y1={-6.75}
        x2={292.501}
        y2={-34.1009}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint19_linear_3264_14144"
        x1={235.605}
        y1={-32}
        x2={211.096}
        y2={14.4393}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint20_linear_3264_14144"
        x1={-21}
        y1={63}
        x2={-55.4674}
        y2={-11.9747}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint21_linear_3264_14144"
        x1={-12.5}
        y1={0.999999}
        x2={0.272636}
        y2={58.5225}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint22_linear_3264_14144"
        x1={307.25}
        y1={33.25}
        x2={416}
        y2={3}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint23_linear_3264_14144"
        x1={356.75}
        y1={8}
        x2={333}
        y2={55.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint24_linear_3264_14144"
        x1={257}
        y1={103}
        x2={223.133}
        y2={27.3397}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint25_linear_3264_14144"
        x1={265.73}
        y1={41}
        x2={278.197}
        y2={98.6633}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint26_linear_3264_14144"
        x1={243.25}
        y1={59}
        x2={226.615}
        y2={-51.898}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint27_linear_3264_14144"
        x1={265.73}
        y1={-38.8158}
        x2={277.577}
        y2={17.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint28_linear_3264_14144"
        x1={335}
        y1={21.5526}
        x2={302.611}
        y2={-52.7609}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint29_linear_3264_14144"
        x1={343.73}
        y1={-38.8158}
        x2={355.577}
        y2={17.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint30_linear_3264_14144"
        x1={67.25}
        y1={33.25}
        x2={176}
        y2={3}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint31_linear_3264_14144"
        x1={116.75}
        y1={8}
        x2={93}
        y2={55.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint32_linear_3264_14144"
        x1={43.25}
        y1={19}
        x2={26.6148}
        y2={-91.898}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint33_linear_3264_14144"
        x1={65.7297}
        y1={-78.8158}
        x2={77.5766}
        y2={-22.5395}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint34_linear_3264_14144"
        x1={-38.75}
        y1={19}
        x2={-55.3852}
        y2={-91.898}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint35_linear_3264_14144"
        x1={-16.2703}
        y1={-78.8158}
        x2={-4.42337}
        y2={-22.5395}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint36_linear_3264_14144"
        x1={26.9803}
        y1={73.25}
        x2={133.265}
        y2={44.4638}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint37_linear_3264_14144"
        x1={75.1776}
        y1={48}
        x2={51.0501}
        y2={94.9852}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint38_linear_3264_14144"
        x1={17}
        y1={21.5526}
        x2={-15.3891}
        y2={-52.7609}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint39_linear_3264_14144"
        x1={25.7297}
        y1={-38.8158}
        x2={37.5766}
        y2={17.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint40_linear_3264_14144"
        x1={-65}
        y1={21.5526}
        x2={-97.3891}
        y2={-52.7609}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint41_linear_3264_14144"
        x1={-56.2703}
        y1={-38.8158}
        x2={-44.4234}
        y2={17.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint42_linear_3264_14144"
        x1={0}
        y1={50}
        x2={342}
        y2={50}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2743DD" />
        <stop offset={1} stopColor="#3A4EBF" stopOpacity={0.4} />
      </linearGradient>
      <linearGradient
        id="paint43_linear_3264_14144"
        x1={0}
        y1={50}
        x2={342}
        y2={50}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8391EF" />
        <stop offset={0.475527} stopColor="#6474D9" stopOpacity={0} />
        <stop offset={1} stopColor="#6474D9" stopOpacity={0.24} />
      </linearGradient>
      <linearGradient
        id="paint44_linear_3264_14144"
        x1={210}
        y1={49.5892}
        x2={324.943}
        y2={50.2876}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#7285FF" stopOpacity={0} />
        <stop offset={1} stopColor="#7285FF" stopOpacity={0.4} />
      </linearGradient>
      <radialGradient
        id="paint45_radial_3264_14144"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(48 52) rotate(90) scale(38 38)"
      >
        <stop offset={0.319715} stopColor="#0D0D28" stopOpacity={0} />
        <stop offset={1} stopColor="#0D0D28" />
      </radialGradient>
      <linearGradient
        id="paint46_linear_3264_14144"
        x1={282.536}
        y1={36}
        x2={282.345}
        y2={59.9991}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.601585} stopColor="#E0DDFF" />
        <stop offset={0.923372} stopColor="#989DFF" />
      </linearGradient>
      <image
        id={`image0_3264_14144${player.index}`}
        width={735}
        height={809}
        preserveAspectRatio="none"
        xlinkHref={player.profilePic}
      />
      <image
        id="image1_3264_14144"
        width={128}
        height={128}
        preserveAspectRatio="none"
        xlinkHref={getSmile(player.rep)}
      />
    </defs>
  </svg>
);
export const mobileViewCard_three = ({ player }) => (
  <svg
    width={343}
    height={92}
    viewBox="0 0 343 92"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <foreignObject x={-48} y={-48} width={438} height={188}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          //backdropFilter: "blur(24px)",
          clipPath: "url(#bgblur_0_3264_14223_clip_path)",
          height: "100%",
          width: "100%",
        }}
      />
    </foreignObject>
    <path
      data-figma-bg-blur-radius={48}
      d="M124 4H218L222 0H330L342 8V84L330 92H222L218 88H124L120 92H12L0 84V8L12 0H120L124 4Z"
      fill="url(#paint0_linear_3264_14223)"
      fillOpacity={0.4}
    />
    <mask
      id="mask0_3264_14223"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={342}
      height={92}
    >
      <path
        d="M124 4H218L222 0H330L342 8V84L330 92H222L218 88H124L120 92H12L0 84V8L12 0H120L124 4Z"
        fill="url(#paint1_linear_3264_14223)"
      />
    </mask>
    <g mask="url(#mask0_3264_14223)">
      <g
        style={{
          mixBlendMode: "luminosity",
        }}
      >
        <path
          d="M175 8L213 46L175 84L137 46L175 8Z"
          fill="url(#paint2_linear_3264_14223)"
          fillOpacity={0.32}
        />
        <path
          d="M212.152 46L175 83.1523L137.848 46L175 8.84766L212.152 46Z"
          stroke="url(#paint3_linear_3264_14223)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M175 -72L213 -34L175 4L137 -34L175 -72Z"
          fill="url(#paint4_linear_3264_14223)"
          fillOpacity={0.48}
        />
        <path
          d="M212.152 -34L175 3.15234L137.848 -34L175 -71.1523L212.152 -34Z"
          stroke="url(#paint5_linear_3264_14223)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M135 48L173 86L135 124L97 86L135 48Z"
          fill="url(#paint6_linear_3264_14223)"
          fillOpacity={0.48}
        />
        <path
          d="M172.152 86L135 123.152L97.8477 86L135 48.8477L172.152 86Z"
          stroke="url(#paint7_linear_3264_14223)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M135 -32L173 6L135 44L99 6L135 -32Z"
          fill="url(#paint8_linear_3264_14223)"
          fillOpacity={0.48}
        />
        <path
          d="M172.152 6L135.012 43.1396L99.8262 6L135.012 -31.1406L172.152 6Z"
          stroke="url(#paint9_linear_3264_14223)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M255 8L293 46L255 84L217 46L255 8Z"
          fill="url(#paint10_linear_3264_14223)"
          fillOpacity={0.24}
        />
        <path
          d="M292.152 46L255 83.1523L217.848 46L255 8.84766L292.152 46Z"
          stroke="url(#paint11_linear_3264_14223)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M255 -72L291 -34L255 4L217 -34L255 -72Z"
          fill="url(#paint12_linear_3264_14223)"
          fillOpacity={0.48}
        />
        <path
          d="M290.173 -34L254.987 3.13965L217.848 -34L254.987 -71.1406L290.173 -34Z"
          stroke="url(#paint13_linear_3264_14223)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M333 -72L369 -34L333 4L295 -34L333 -72Z"
          fill="url(#paint14_linear_3264_14223)"
          fillOpacity={0.48}
        />
        <path
          d="M368.173 -34L332.987 3.13965L295.848 -34L332.987 -71.1406L368.173 -34Z"
          stroke="url(#paint15_linear_3264_14223)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M215 50L253 86L215 124L177 86L215 50Z"
          fill="url(#paint16_linear_3264_14223)"
          fillOpacity={0.48}
        />
        <path
          d="M252.14 86.0117L215 123.152L177.859 86.0117L215 50.8262L252.14 86.0117Z"
          stroke="url(#paint17_linear_3264_14223)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M215 -32L251 6L215 44L179 6L215 -32Z"
          fill="url(#paint18_linear_3264_14223)"
          fillOpacity={0.48}
        />
        <path
          d="M250.173 6L215 43.127L179.826 6L215 -31.1279L250.173 6Z"
          stroke="url(#paint19_linear_3264_14223)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M15 8L53 46L15 84L-21 46L15 8Z"
          fill="url(#paint20_linear_3264_14223)"
          fillOpacity={0.64}
        />
        <path
          d="M52.1523 46L15.0117 83.1396L-20.1738 46L15.0117 8.85938L52.1523 46Z"
          stroke="url(#paint21_linear_3264_14223)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M335 8L373 46L335 84L297 46L335 8Z"
          fill="url(#paint22_linear_3264_14223)"
          fillOpacity={0.64}
        />
        <path
          d="M372.152 46L335 83.1523L297.848 46L335 8.84766L372.152 46Z"
          stroke="url(#paint23_linear_3264_14223)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M295 48L333 86L295 124L257 86L295 48Z"
          fill="url(#paint24_linear_3264_14223)"
          fillOpacity={0.48}
        />
        <path
          d="M332.152 86L295 123.152L257.848 86L295 48.8477L332.152 86Z"
          stroke="url(#paint25_linear_3264_14223)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M295 -32L333 6L293 42L257 6L295 -32Z"
          fill="url(#paint26_linear_3264_14223)"
          fillOpacity={0.48}
        />
        <path
          d="M332.128 5.97559L293.021 41.1729L257.848 6L295 -31.1523L332.128 5.97559Z"
          stroke="url(#paint27_linear_3264_14223)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M373 -32L411 6L371 42L335 6L373 -32Z"
          fill="url(#paint28_linear_3264_14223)"
          fillOpacity={0.64}
        />
        <path
          d="M410.128 5.97559L371.021 41.1729L335.848 6L373 -31.1523L410.128 5.97559Z"
          stroke="url(#paint29_linear_3264_14223)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M95 8L133 46L95 84L57 46L95 8Z"
          fill="url(#paint30_linear_3264_14223)"
          fillOpacity={0.48}
        />
        <path
          d="M132.152 46L95 83.1523L57.8477 46L95 8.84766L132.152 46Z"
          stroke="url(#paint31_linear_3264_14223)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M95 -72L133 -34L95 2L57 -34L95 -72Z"
          fill="url(#paint32_linear_3264_14223)"
          fillOpacity={0.48}
        />
        <path
          d="M132.14 -34.0127L95 1.17285L57.8594 -34.0127L95 -71.1523L132.14 -34.0127Z"
          stroke="url(#paint33_linear_3264_14223)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M13 -72L51 -34L13 2L-25 -34L13 -72Z"
          fill="url(#paint34_linear_3264_14223)"
          fillOpacity={0.48}
        />
        <path
          d="M50.1396 -34.0127L13 1.17285L-24.1406 -34.0127L13 -71.1523L50.1396 -34.0127Z"
          stroke="url(#paint35_linear_3264_14223)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M55 48L91 86L55 124L17 86L55 48Z"
          fill="url(#paint36_linear_3264_14223)"
          fillOpacity={0.48}
        />
        <path
          d="M90.1729 86L54.9873 123.14L17.8477 86L54.9873 48.8594L90.1729 86Z"
          stroke="url(#paint37_linear_3264_14223)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M55 -32L93 6L57 42L17 6L55 -32Z"
          fill="url(#paint38_linear_3264_14223)"
          fillOpacity={0.48}
        />
        <path
          d="M92.1523 6L56.9785 41.1729L17.8711 5.97559L55 -31.1523L92.1523 6Z"
          stroke="url(#paint39_linear_3264_14223)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M-27 -32L11 6L-25 42L-65 6L-27 -32Z"
          fill="url(#paint40_linear_3264_14223)"
          fillOpacity={0.48}
        />
        <path
          d="M10.1523 6L-25.0215 41.1729L-64.1289 5.97559L-27 -31.1523L10.1523 6Z"
          stroke="url(#paint41_linear_3264_14223)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
      </g>
    </g>
    <g filter="url(#filter1_i_3264_14223)">
      <path
        d="M124 4H218L222 0H330L342 8V84L330 92H222L218 88H124L120 92H12L0 84V8L12 0H120L124 4Z"
        fill="url(#paint42_linear_3264_14223)"
        fillOpacity={0.08}
      />
    </g>
    <path
      d="M119.793 0.5L123.793 4.5H218.207L222.207 0.5H329.849L341.5 8.26758V83.7324L329.849 91.5H222.207L218.207 87.5H123.793L119.793 91.5H12.1514L0.5 83.7324V8.26758L12.1514 0.5H119.793Z"
      stroke="url(#paint43_linear_3264_14223)"
    />
    <path
      d="M210 24H341V68H210V24Z"
      fill="url(#paint44_linear_3264_14223)"
      fillOpacity={0.6}
    />
    <text
      fill="#F4F7FF"
      xmlSpace="preserve"
      style={{
        whiteSpace: "pre",
      }}
      fontFamily="Cairo"
      fontSize={16}
      fontWeight="bold"
      letterSpacing="0em"
    >
      <tspan x={92} y={39.856}>
        {player.gameID}
      </tspan>
    </text>
    <text
      fill="#8598F6"
      xmlSpace="preserve"
      style={{
        whiteSpace: "pre",
      }}
      fontFamily="Cairo"
      fontSize={14}
      fontWeight={500}
      letterSpacing="0em"
    >
      <tspan x={92} y={65.124}>
        {`@${player.username}`}
      </tspan>
    </text>
    <path
      d="M24 12C28.5508 12 32.5097 14.5334 34.5439 18.2666C38.0739 16.8068 41.9426 16 46 16C62.5685 16 76 29.4315 76 46C76 62.5685 62.5685 76 46 76C29.4315 76 16 62.5685 16 46C16 41.9426 16.8068 38.0739 18.2666 34.5439C14.5334 32.5097 12 28.5508 12 24C12 17.3726 17.3726 12 24 12Z"
      fill="url(#paint45_radial_3264_14223)"
      fillOpacity={0.6}
    />
    <g filter="url(#filter2_d_3264_14223)">
      <path
        d="M46 22C59.2548 22 70 32.7452 70 46C70 59.2548 59.2548 70 46 70C32.7452 70 22 59.2548 22 46C22 42.43 22.7797 39.0421 24.1777 35.9971C30.664 35.9029 35.9029 30.664 35.9971 24.1777C39.0421 22.7797 42.43 22 46 22Z"
        fill={`url(#pattern0_3264_14223${player.index})`}
        shapeRendering="crispEdges"
      />
    </g>
    <mask
      id="mask1_3264_14223"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={16}
      y={16}
      width={16}
      height={16}
    >
      <rect
        x={16}
        y={16}
        width={16}
        height={16}
        fill="url(#pattern1_3264_14223)"
      />
    </mask>
    <g mask="url(#mask1_3264_14223)">
      <rect x={16} y={16} width={16} height={16} fill={getColor(player.rep)} />
    </g>
    
      <text
        fill="#fff"
        xmlSpace="preserve"
        style={{
          whiteSpace: "pre",
        }}
        textAnchor="end"
        fontFamily="Cairo"
        fontSize={22}
        fontWeight="bold"
        letterSpacing="0em"
      >
        <tspan x={320} y={52.052}>
          {player.score}
        </tspan>
      </text>
 
    <defs>
      <clipPath id="bgblur_0_3264_14223_clip_path" transform="translate(48 48)">
        <path d="M124 4H218L222 0H330L342 8V84L330 92H222L218 88H124L120 92H12L0 84V8L12 0H120L124 4Z" />
      </clipPath>
      <filter
        id="filter1_i_3264_14223"
        x={0}
        y={0}
        width={346}
        height={92}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx={4} />
        <feGaussianBlur stdDeviation={6} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.0114183 0 0 0 0 0.0237149 0 0 0 0 0.0913462 0 0 0 0.4 0"
        />
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_3264_14223"
        />
      </filter>
      <filter
        id="filter2_d_3264_14223"
        x={20}
        y={22}
        width={52}
        height={52}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={2} />
        <feGaussianBlur stdDeviation={1} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0.00392157 0 0 0 0 0.0235294 0 0 0 0.24 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3264_14223"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_3264_14223"
          result="shape"
        />
      </filter>
      <pattern
        id={`pattern0_3264_14223${player.index}`}
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <use
          xlinkHref={`#image0_3264_14223${player.index}`}
          transform="translate(0 -0.0748299) scale(0.00136054)"
        />
      </pattern>
      <pattern
        id="pattern1_3264_14223"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <use
          xlinkHref="#image1_3264_14223"
          transform="translate(-0.0423729 -0.0423729) scale(0.00847458)"
        />
      </pattern>
      <filter
        id="filter3_d_3264_14223"
        x={221.106}
        y={17.216}
        width={121.887}
        height={63.026}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={12} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.0117647 0 0 0 0 0.0235294 0 0 0 0 0.0901961 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3264_14223"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_3264_14223"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_3264_14223"
        x1={0}
        y1={46}
        x2={342}
        y2={46}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2743DD" />
        <stop offset={1} stopColor="#3A4EBF" stopOpacity={0.4} />
      </linearGradient>
      <linearGradient
        id="paint1_linear_3264_14223"
        x1={0}
        y1={46}
        x2={342}
        y2={46}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#D9D9D9" stopOpacity={0.2} />
        <stop offset={1} stopColor="#D9D9D9" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_3264_14223"
        x1={123.25}
        y1={101.459}
        x2={105.725}
        y2={-12.2986}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint3_linear_3264_14223"
        x1={145.73}
        y1={0.999999}
        x2={158.197}
        y2={58.6633}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint4_linear_3264_14223"
        x1={147.25}
        y1={-46.75}
        x2={256}
        y2={-77}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint5_linear_3264_14223"
        x1={196.75}
        y1={-72}
        x2={173}
        y2={-24.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint6_linear_3264_14223"
        x1={97}
        y1={103}
        x2={63.1327}
        y2={27.3397}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint7_linear_3264_14223"
        x1={105.73}
        y1={41}
        x2={118.197}
        y2={98.6633}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint8_linear_3264_14223"
        x1={108.98}
        y1={-6.75}
        x2={215.265}
        y2={-35.5362}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint9_linear_3264_14223"
        x1={157.178}
        y1={-32}
        x2={133.05}
        y2={14.9852}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint10_linear_3264_14223"
        x1={227.25}
        y1={33.25}
        x2={336}
        y2={3}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint11_linear_3264_14223"
        x1={276.75}
        y1={8}
        x2={253}
        y2={55.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint12_linear_3264_14223"
        x1={226.98}
        y1={-46.75}
        x2={333.265}
        y2={-75.5362}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint13_linear_3264_14223"
        x1={275.178}
        y1={-72}
        x2={251.05}
        y2={-25.0148}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint14_linear_3264_14223"
        x1={304.98}
        y1={-46.75}
        x2={411.265}
        y2={-75.5362}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint15_linear_3264_14223"
        x1={353.178}
        y1={-72}
        x2={329.05}
        y2={-25.0148}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint16_linear_3264_14223"
        x1={177}
        y1={103.553}
        x2={144.611}
        y2={29.2391}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint17_linear_3264_14223"
        x1={185.73}
        y1={43.1842}
        x2={197.577}
        y2={99.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint18_linear_3264_14223"
        x1={188.711}
        y1={-6.75}
        x2={292.501}
        y2={-34.1009}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint19_linear_3264_14223"
        x1={235.605}
        y1={-32}
        x2={211.096}
        y2={14.4393}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint20_linear_3264_14223"
        x1={-21}
        y1={63}
        x2={-55.4674}
        y2={-11.9747}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint21_linear_3264_14223"
        x1={-12.5}
        y1={0.999999}
        x2={0.272636}
        y2={58.5225}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint22_linear_3264_14223"
        x1={307.25}
        y1={33.25}
        x2={416}
        y2={3}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint23_linear_3264_14223"
        x1={356.75}
        y1={8}
        x2={333}
        y2={55.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint24_linear_3264_14223"
        x1={257}
        y1={103}
        x2={223.133}
        y2={27.3397}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint25_linear_3264_14223"
        x1={265.73}
        y1={41}
        x2={278.197}
        y2={98.6633}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint26_linear_3264_14223"
        x1={243.25}
        y1={59}
        x2={226.615}
        y2={-51.898}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint27_linear_3264_14223"
        x1={265.73}
        y1={-38.8158}
        x2={277.577}
        y2={17.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint28_linear_3264_14223"
        x1={335}
        y1={21.5526}
        x2={302.611}
        y2={-52.7609}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint29_linear_3264_14223"
        x1={343.73}
        y1={-38.8158}
        x2={355.577}
        y2={17.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint30_linear_3264_14223"
        x1={67.25}
        y1={33.25}
        x2={176}
        y2={3}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint31_linear_3264_14223"
        x1={116.75}
        y1={8}
        x2={93}
        y2={55.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint32_linear_3264_14223"
        x1={43.25}
        y1={19}
        x2={26.6148}
        y2={-91.898}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint33_linear_3264_14223"
        x1={65.7297}
        y1={-78.8158}
        x2={77.5766}
        y2={-22.5395}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint34_linear_3264_14223"
        x1={-38.75}
        y1={19}
        x2={-55.3852}
        y2={-91.898}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint35_linear_3264_14223"
        x1={-16.2703}
        y1={-78.8158}
        x2={-4.42337}
        y2={-22.5395}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint36_linear_3264_14223"
        x1={26.9803}
        y1={73.25}
        x2={133.265}
        y2={44.4638}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint37_linear_3264_14223"
        x1={75.1776}
        y1={48}
        x2={51.0501}
        y2={94.9852}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint38_linear_3264_14223"
        x1={17}
        y1={21.5526}
        x2={-15.3891}
        y2={-52.7609}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint39_linear_3264_14223"
        x1={25.7297}
        y1={-38.8158}
        x2={37.5766}
        y2={17.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint40_linear_3264_14223"
        x1={-65}
        y1={21.5526}
        x2={-97.3891}
        y2={-52.7609}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint41_linear_3264_14223"
        x1={-56.2703}
        y1={-38.8158}
        x2={-44.4234}
        y2={17.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint42_linear_3264_14223"
        x1={0}
        y1={46}
        x2={342}
        y2={46}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2743DD" />
        <stop offset={1} stopColor="#3A4EBF" stopOpacity={0.4} />
      </linearGradient>
      <linearGradient
        id="paint43_linear_3264_14223"
        x1={0}
        y1={46}
        x2={342}
        y2={46}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8391EF" />
        <stop offset={0.475527} stopColor="#6474D9" stopOpacity={0} />
        <stop offset={1} stopColor="#6474D9" stopOpacity={0.24} />
      </linearGradient>
      <linearGradient
        id="paint44_linear_3264_14223"
        x1={210}
        y1={45.5892}
        x2={324.943}
        y2={46.2876}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#7285FF" stopOpacity={0} />
        <stop offset={1} stopColor="#7285FF" stopOpacity={0.4} />
      </linearGradient>
      <radialGradient
        id="paint45_radial_3264_14223"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(48 48) rotate(90) scale(38 38)"
      >
        <stop offset={0.319715} stopColor="#0D0D28" stopOpacity={0} />
        <stop offset={1} stopColor="#0D0D28" />
      </radialGradient>
      <linearGradient
        id="paint46_linear_3264_14223"
        x1={282.536}
        y1={32}
        x2={282.345}
        y2={55.9991}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.601585} stopColor="#E0DDFF" />
        <stop offset={0.923372} stopColor="#989DFF" />
      </linearGradient>
      <image
        id={`image0_3264_14223${player.index}`}
        width={735}
        height={845}
        preserveAspectRatio="none"
        xlinkHref={player.profilePic}
      />
      <image
        id="image1_3264_14223"
        width={128}
        height={128}
        preserveAspectRatio="none"
        xlinkHref={getSmile(player.rep)}
      />
    </defs>
  </svg>
);
export const mobileViewCard_four = ({ player }) => (
  <svg
    width={343}
    height={100}
    viewBox="0 0 343 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <foreignObject x={-48} y={-48} width={438} height={196}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          //backdropFilter: "blur(24px)",
          clipPath: "url(#bgblur_0_3264_14298_clip_path)",
          height: "100%",
          width: "100%",
        }}
      />
    </foreignObject>
    <path
      data-figma-bg-blur-radius={48}
      d="M214 100H128L124 96H12L0 88V12L12 4H124L128 0H214L218 4H330L342 12V88L330 96H218L214 100Z"
      fill="url(#paint0_linear_3264_14298)"
      fillOpacity={0.4}
    />
    <mask
      id="mask0_3264_14298"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={342}
      height={100}
    >
      <path
        d="M214 100H128L124 96H12L0 88V12L12 4H124L128 0H214L218 4H330L342 12V88L330 96H218L214 100Z"
        fill="url(#paint1_linear_3264_14298)"
      />
    </mask>
    <g mask="url(#mask0_3264_14298)">
      <g
        style={{
          mixBlendMode: "luminosity",
        }}
      >
        <path
          d="M175 8L213 46L175 84L137 46L175 8Z"
          fill="url(#paint2_linear_3264_14298)"
          fillOpacity={0.32}
        />
        <path
          d="M212.152 46L175 83.1523L137.848 46L175 8.84766L212.152 46Z"
          stroke="url(#paint3_linear_3264_14298)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M175 -72L213 -34L175 4L137 -34L175 -72Z"
          fill="url(#paint4_linear_3264_14298)"
          fillOpacity={0.48}
        />
        <path
          d="M212.152 -34L175 3.15234L137.848 -34L175 -71.1523L212.152 -34Z"
          stroke="url(#paint5_linear_3264_14298)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M135 48L173 86L135 124L97 86L135 48Z"
          fill="url(#paint6_linear_3264_14298)"
          fillOpacity={0.48}
        />
        <path
          d="M172.152 86L135 123.152L97.8477 86L135 48.8477L172.152 86Z"
          stroke="url(#paint7_linear_3264_14298)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M135 -32L173 6L135 44L99 6L135 -32Z"
          fill="url(#paint8_linear_3264_14298)"
          fillOpacity={0.48}
        />
        <path
          d="M172.152 6L135.012 43.1396L99.8262 6L135.012 -31.1406L172.152 6Z"
          stroke="url(#paint9_linear_3264_14298)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M255 8L293 46L255 84L217 46L255 8Z"
          fill="url(#paint10_linear_3264_14298)"
          fillOpacity={0.24}
        />
        <path
          d="M292.152 46L255 83.1523L217.848 46L255 8.84766L292.152 46Z"
          stroke="url(#paint11_linear_3264_14298)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M255 -72L291 -34L255 4L217 -34L255 -72Z"
          fill="url(#paint12_linear_3264_14298)"
          fillOpacity={0.48}
        />
        <path
          d="M290.173 -34L254.987 3.13965L217.848 -34L254.987 -71.1406L290.173 -34Z"
          stroke="url(#paint13_linear_3264_14298)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M333 -72L369 -34L333 4L295 -34L333 -72Z"
          fill="url(#paint14_linear_3264_14298)"
          fillOpacity={0.48}
        />
        <path
          d="M368.173 -34L332.987 3.13965L295.848 -34L332.987 -71.1406L368.173 -34Z"
          stroke="url(#paint15_linear_3264_14298)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M215 50L253 86L215 124L177 86L215 50Z"
          fill="url(#paint16_linear_3264_14298)"
          fillOpacity={0.48}
        />
        <path
          d="M252.14 86.0117L215 123.152L177.859 86.0117L215 50.8262L252.14 86.0117Z"
          stroke="url(#paint17_linear_3264_14298)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M215 -32L251 6L215 44L179 6L215 -32Z"
          fill="url(#paint18_linear_3264_14298)"
          fillOpacity={0.48}
        />
        <path
          d="M250.173 6L215 43.127L179.826 6L215 -31.1279L250.173 6Z"
          stroke="url(#paint19_linear_3264_14298)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M15 8L53 46L15 84L-21 46L15 8Z"
          fill="url(#paint20_linear_3264_14298)"
          fillOpacity={0.64}
        />
        <path
          d="M52.1523 46L15.0117 83.1396L-20.1738 46L15.0117 8.85938L52.1523 46Z"
          stroke="url(#paint21_linear_3264_14298)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M335 8L373 46L335 84L297 46L335 8Z"
          fill="url(#paint22_linear_3264_14298)"
          fillOpacity={0.64}
        />
        <path
          d="M372.152 46L335 83.1523L297.848 46L335 8.84766L372.152 46Z"
          stroke="url(#paint23_linear_3264_14298)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M295 48L333 86L295 124L257 86L295 48Z"
          fill="url(#paint24_linear_3264_14298)"
          fillOpacity={0.48}
        />
        <path
          d="M332.152 86L295 123.152L257.848 86L295 48.8477L332.152 86Z"
          stroke="url(#paint25_linear_3264_14298)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M295 -32L333 6L293 42L257 6L295 -32Z"
          fill="url(#paint26_linear_3264_14298)"
          fillOpacity={0.48}
        />
        <path
          d="M332.128 5.97559L293.021 41.1729L257.848 6L295 -31.1523L332.128 5.97559Z"
          stroke="url(#paint27_linear_3264_14298)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M373 -32L411 6L371 42L335 6L373 -32Z"
          fill="url(#paint28_linear_3264_14298)"
          fillOpacity={0.64}
        />
        <path
          d="M410.128 5.97559L371.021 41.1729L335.848 6L373 -31.1523L410.128 5.97559Z"
          stroke="url(#paint29_linear_3264_14298)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M95 8L133 46L95 84L57 46L95 8Z"
          fill="url(#paint30_linear_3264_14298)"
          fillOpacity={0.48}
        />
        <path
          d="M132.152 46L95 83.1523L57.8477 46L95 8.84766L132.152 46Z"
          stroke="url(#paint31_linear_3264_14298)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M95 -72L133 -34L95 2L57 -34L95 -72Z"
          fill="url(#paint32_linear_3264_14298)"
          fillOpacity={0.48}
        />
        <path
          d="M132.14 -34.0127L95 1.17285L57.8594 -34.0127L95 -71.1523L132.14 -34.0127Z"
          stroke="url(#paint33_linear_3264_14298)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M13 -72L51 -34L13 2L-25 -34L13 -72Z"
          fill="url(#paint34_linear_3264_14298)"
          fillOpacity={0.48}
        />
        <path
          d="M50.1396 -34.0127L13 1.17285L-24.1406 -34.0127L13 -71.1523L50.1396 -34.0127Z"
          stroke="url(#paint35_linear_3264_14298)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M55 48L91 86L55 124L17 86L55 48Z"
          fill="url(#paint36_linear_3264_14298)"
          fillOpacity={0.48}
        />
        <path
          d="M90.1729 86L54.9873 123.14L17.8477 86L54.9873 48.8594L90.1729 86Z"
          stroke="url(#paint37_linear_3264_14298)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M55 -32L93 6L57 42L17 6L55 -32Z"
          fill="url(#paint38_linear_3264_14298)"
          fillOpacity={0.48}
        />
        <path
          d="M92.1523 6L56.9785 41.1729L17.8711 5.97559L55 -31.1523L92.1523 6Z"
          stroke="url(#paint39_linear_3264_14298)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M-27 -32L11 6L-25 42L-65 6L-27 -32Z"
          fill="url(#paint40_linear_3264_14298)"
          fillOpacity={0.48}
        />
        <path
          d="M10.1523 6L-25.0215 41.1729L-64.1289 5.97559L-27 -31.1523L10.1523 6Z"
          stroke="url(#paint41_linear_3264_14298)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
      </g>
    </g>
    <g filter="url(#filter1_i_3264_14298)">
      <path
        d="M214 100H128L124 96H12L0 88V12L12 4H124L128 0H214L218 4H330L342 12V88L330 96H218L214 100Z"
        fill="url(#paint42_linear_3264_14298)"
        fillOpacity={0.08}
      />
    </g>
    <path
      d="M213.793 0.5L217.793 4.5H329.849L341.5 12.2676V87.7324L329.849 95.5H217.793L213.793 99.5H128.207L124.207 95.5H12.1514L0.5 87.7324V12.2676L12.1514 4.5H124.207L128.207 0.5H213.793Z"
      stroke="url(#paint43_linear_3264_14298)"
    />
    <path
      d="M210 28H341V72H210V28Z"
      fill="url(#paint44_linear_3264_14298)"
      fillOpacity={0.6}
    />
    <text
      fill="#F4F7FF"
      xmlSpace="preserve"
      style={{
        whiteSpace: "pre",
      }}
      fontFamily="Cairo"
      fontSize={16}
      fontWeight="bold"
      letterSpacing="0em"
    >
      <tspan x={92} y={43.856}>
        {player.gameID}
      </tspan>
    </text>
    <text
      fill="#8598F6"
      xmlSpace="preserve"
      style={{
        whiteSpace: "pre",
      }}
      fontFamily="Cairo"
      fontSize={14}
      fontWeight={500}
      letterSpacing="0em"
    >
      <tspan x={92} y={69.124}>
        {`@${player.username}`}
      </tspan>
    </text>
    <path
      d="M24 16C28.5508 16 32.5097 18.5334 34.5439 22.2666C38.0739 20.8068 41.9426 20 46 20C62.5685 20 76 33.4315 76 50C76 66.5685 62.5685 80 46 80C29.4315 80 16 66.5685 16 50C16 45.9426 16.8068 42.0739 18.2666 38.5439C14.5334 36.5097 12 32.5508 12 28C12 21.3726 17.3726 16 24 16Z"
      fill="url(#paint45_radial_3264_14298)"
      fillOpacity={0.6}
    />
    <g filter="url(#filter2_d_3264_14298)">
      <path
        d="M46 26C59.2548 26 70 36.7452 70 50C70 63.2548 59.2548 74 46 74C32.7452 74 22 63.2548 22 50C22 46.43 22.7797 43.0421 24.1777 39.9971C30.664 39.9029 35.9029 34.664 35.9971 28.1777C39.0421 26.7797 42.43 26 46 26Z"
        fill={`url(#pattern0_3264_14298${player.index})`}
        shapeRendering="crispEdges"
      />
    </g>
    <mask
      id="mask1_3264_14298"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={16}
      y={20}
      width={16}
      height={16}
    >
      <rect
        x={16}
        y={20}
        width={16}
        height={16}
        fill="url(#pattern1_3264_14298)"
      />
    </mask>
    <g mask="url(#mask1_3264_14298)">
      <rect x={16} y={20} width={16} height={16} fill={getColor(player.rep)} />
    </g>
    
      <text
         fill="#fff"
        xmlSpace="preserve"
        style={{
          whiteSpace: "pre",
        }}
        textAnchor="end"
        fontFamily="Cairo"
        fontSize={22}
        fontWeight="bold"
        letterSpacing="0em"
      >
        <tspan x={320} y={56.052}>
          {player.score}
        </tspan>
      </text>
    
    <defs>
      <clipPath id="bgblur_0_3264_14298_clip_path" transform="translate(48 48)">
        <path d="M214 100H128L124 96H12L0 88V12L12 4H124L128 0H214L218 4H330L342 12V88L330 96H218L214 100Z" />
      </clipPath>
      <filter
        id="filter1_i_3264_14298"
        x={0}
        y={0}
        width={346}
        height={100}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx={4} />
        <feGaussianBlur stdDeviation={6} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.0114183 0 0 0 0 0.0237149 0 0 0 0 0.0913462 0 0 0 0.4 0"
        />
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_3264_14298"
        />
      </filter>
      <filter
        id="filter2_d_3264_14298"
        x={20}
        y={26}
        width={52}
        height={52}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={2} />
        <feGaussianBlur stdDeviation={1} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0.00392157 0 0 0 0 0.0235294 0 0 0 0.24 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3264_14298"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_3264_14298"
          result="shape"
        />
      </filter>
      <pattern
        id={`pattern0_3264_14298${player.index}`}
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <use
          xlinkHref={`#image0_3264_14298${player.index}`}
          transform="translate(0 -0.05) scale(0.00166667)"
        />
      </pattern>
      <pattern
        id="pattern1_3264_14298"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <use xlinkHref="#image1_3264_14298" transform="scale(0.0078125)" />
      </pattern>
      <filter
        id="filter3_d_3264_14298"
        x={221.106}
        y={21.238}
        width={121.887}
        height={63.0039}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={12} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.0117647 0 0 0 0 0.0235294 0 0 0 0 0.0901961 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3264_14298"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_3264_14298"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_3264_14298"
        x1={0}
        y1={50}
        x2={342}
        y2={50}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2743DD" />
        <stop offset={1} stopColor="#3A4EBF" stopOpacity={0.4} />
      </linearGradient>
      <linearGradient
        id="paint1_linear_3264_14298"
        x1={0}
        y1={50}
        x2={342}
        y2={50}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#D9D9D9" stopOpacity={0.2} />
        <stop offset={1} stopColor="#D9D9D9" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_3264_14298"
        x1={123.25}
        y1={101.459}
        x2={105.725}
        y2={-12.2986}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint3_linear_3264_14298"
        x1={145.73}
        y1={0.999999}
        x2={158.197}
        y2={58.6633}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint4_linear_3264_14298"
        x1={147.25}
        y1={-46.75}
        x2={256}
        y2={-77}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint5_linear_3264_14298"
        x1={196.75}
        y1={-72}
        x2={173}
        y2={-24.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint6_linear_3264_14298"
        x1={97}
        y1={103}
        x2={63.1327}
        y2={27.3397}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint7_linear_3264_14298"
        x1={105.73}
        y1={41}
        x2={118.197}
        y2={98.6633}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint8_linear_3264_14298"
        x1={108.98}
        y1={-6.75}
        x2={215.265}
        y2={-35.5362}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint9_linear_3264_14298"
        x1={157.178}
        y1={-32}
        x2={133.05}
        y2={14.9852}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint10_linear_3264_14298"
        x1={227.25}
        y1={33.25}
        x2={336}
        y2={3}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint11_linear_3264_14298"
        x1={276.75}
        y1={8}
        x2={253}
        y2={55.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint12_linear_3264_14298"
        x1={226.98}
        y1={-46.75}
        x2={333.265}
        y2={-75.5362}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint13_linear_3264_14298"
        x1={275.178}
        y1={-72}
        x2={251.05}
        y2={-25.0148}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint14_linear_3264_14298"
        x1={304.98}
        y1={-46.75}
        x2={411.265}
        y2={-75.5362}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint15_linear_3264_14298"
        x1={353.178}
        y1={-72}
        x2={329.05}
        y2={-25.0148}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint16_linear_3264_14298"
        x1={177}
        y1={103.553}
        x2={144.611}
        y2={29.2391}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint17_linear_3264_14298"
        x1={185.73}
        y1={43.1842}
        x2={197.577}
        y2={99.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint18_linear_3264_14298"
        x1={188.711}
        y1={-6.75}
        x2={292.501}
        y2={-34.1009}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint19_linear_3264_14298"
        x1={235.605}
        y1={-32}
        x2={211.096}
        y2={14.4393}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint20_linear_3264_14298"
        x1={-21}
        y1={63}
        x2={-55.4674}
        y2={-11.9747}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint21_linear_3264_14298"
        x1={-12.5}
        y1={0.999999}
        x2={0.272636}
        y2={58.5225}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint22_linear_3264_14298"
        x1={307.25}
        y1={33.25}
        x2={416}
        y2={3}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint23_linear_3264_14298"
        x1={356.75}
        y1={8}
        x2={333}
        y2={55.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint24_linear_3264_14298"
        x1={257}
        y1={103}
        x2={223.133}
        y2={27.3397}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint25_linear_3264_14298"
        x1={265.73}
        y1={41}
        x2={278.197}
        y2={98.6633}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint26_linear_3264_14298"
        x1={243.25}
        y1={59}
        x2={226.615}
        y2={-51.898}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint27_linear_3264_14298"
        x1={265.73}
        y1={-38.8158}
        x2={277.577}
        y2={17.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint28_linear_3264_14298"
        x1={335}
        y1={21.5526}
        x2={302.611}
        y2={-52.7609}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint29_linear_3264_14298"
        x1={343.73}
        y1={-38.8158}
        x2={355.577}
        y2={17.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint30_linear_3264_14298"
        x1={67.25}
        y1={33.25}
        x2={176}
        y2={3}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint31_linear_3264_14298"
        x1={116.75}
        y1={8}
        x2={93}
        y2={55.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint32_linear_3264_14298"
        x1={43.25}
        y1={19}
        x2={26.6148}
        y2={-91.898}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint33_linear_3264_14298"
        x1={65.7297}
        y1={-78.8158}
        x2={77.5766}
        y2={-22.5395}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint34_linear_3264_14298"
        x1={-38.75}
        y1={19}
        x2={-55.3852}
        y2={-91.898}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint35_linear_3264_14298"
        x1={-16.2703}
        y1={-78.8158}
        x2={-4.42337}
        y2={-22.5395}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint36_linear_3264_14298"
        x1={26.9803}
        y1={73.25}
        x2={133.265}
        y2={44.4638}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint37_linear_3264_14298"
        x1={75.1776}
        y1={48}
        x2={51.0501}
        y2={94.9852}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint38_linear_3264_14298"
        x1={17}
        y1={21.5526}
        x2={-15.3891}
        y2={-52.7609}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint39_linear_3264_14298"
        x1={25.7297}
        y1={-38.8158}
        x2={37.5766}
        y2={17.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint40_linear_3264_14298"
        x1={-65}
        y1={21.5526}
        x2={-97.3891}
        y2={-52.7609}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint41_linear_3264_14298"
        x1={-56.2703}
        y1={-38.8158}
        x2={-44.4234}
        y2={17.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint42_linear_3264_14298"
        x1={0}
        y1={50}
        x2={342}
        y2={50}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2743DD" />
        <stop offset={1} stopColor="#3A4EBF" stopOpacity={0.4} />
      </linearGradient>
      <linearGradient
        id="paint43_linear_3264_14298"
        x1={0}
        y1={50}
        x2={342}
        y2={50}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8391EF" />
        <stop offset={0.475527} stopColor="#6474D9" stopOpacity={0} />
        <stop offset={1} stopColor="#6474D9" stopOpacity={0.24} />
      </linearGradient>
      <linearGradient
        id="paint44_linear_3264_14298"
        x1={210}
        y1={49.5892}
        x2={324.943}
        y2={50.2876}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#7285FF" stopOpacity={0} />
        <stop offset={1} stopColor="#7285FF" stopOpacity={0.4} />
      </linearGradient>
      <radialGradient
        id="paint45_radial_3264_14298"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(48 52) rotate(90) scale(38 38)"
      >
        <stop offset={0.319715} stopColor="#0D0D28" stopOpacity={0} />
        <stop offset={1} stopColor="#0D0D28" />
      </radialGradient>
      <linearGradient
        id="paint46_linear_3264_14298"
        x1={282.536}
        y1={36}
        x2={282.345}
        y2={59.9991}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.601585} stopColor="#E0DDFF" />
        <stop offset={0.923372} stopColor="#989DFF" />
      </linearGradient>
      <image
        id={`image0_3264_14298${player.index}`}
        width={600}
        height={660}
        preserveAspectRatio="none"
        xlinkHref={player.profilePic}
      />
      <image
        id="image1_3264_14298"
        width={128}
        height={128}
        preserveAspectRatio="none"
        xlinkHref={getSmile(player.rep)}
      />
    </defs>
  </svg>
);
export const mobileViewCard_Last_odd = ({ player }) => (
  <svg
    width={345}
    height={92}
    viewBox="0 0 345 92"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <foreignObject x={-48} y={-48} width={438} height={188}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          //backdropFilter: "blur(24px)",
          clipPath: "url(#bgblur_0_3264_14377_clip_path)",
          height: "100%",
          width: "100%",
        }}
      />
    </foreignObject>
    <path
      data-figma-bg-blur-radius={48}
      d="M342 8V84L330 92H12L0 84V8L12 0H120L124 4H218L222 0H330L342 8Z"
      fill="url(#paint0_linear_3264_14377)"
      fillOpacity={0.4}
    />
    <mask
      id="mask0_3264_14377"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={342}
      height={92}
    >
      <path
        d="M342 8V84L330 92H12L0 84V8L12 0H120L124 4H218L222 0H330L342 8Z"
        fill="url(#paint1_linear_3264_14377)"
      />
    </mask>
    <g mask="url(#mask0_3264_14377)">
      <g
        style={{
          mixBlendMode: "luminosity",
        }}
      >
        <path
          d="M175 8L213 46L175 84L137 46L175 8Z"
          fill="url(#paint2_linear_3264_14377)"
          fillOpacity={0.32}
        />
        <path
          d="M212.152 46L175 83.1523L137.848 46L175 8.84766L212.152 46Z"
          stroke="url(#paint3_linear_3264_14377)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M175 -72L213 -34L175 4L137 -34L175 -72Z"
          fill="url(#paint4_linear_3264_14377)"
          fillOpacity={0.48}
        />
        <path
          d="M212.152 -34L175 3.15234L137.848 -34L175 -71.1523L212.152 -34Z"
          stroke="url(#paint5_linear_3264_14377)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M135 48L173 86L135 124L97 86L135 48Z"
          fill="url(#paint6_linear_3264_14377)"
          fillOpacity={0.48}
        />
        <path
          d="M172.152 86L135 123.152L97.8477 86L135 48.8477L172.152 86Z"
          stroke="url(#paint7_linear_3264_14377)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M135 -32L173 6L135 44L99 6L135 -32Z"
          fill="url(#paint8_linear_3264_14377)"
          fillOpacity={0.48}
        />
        <path
          d="M172.152 6L135.012 43.1396L99.8262 6L135.012 -31.1406L172.152 6Z"
          stroke="url(#paint9_linear_3264_14377)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M255 8L293 46L255 84L217 46L255 8Z"
          fill="url(#paint10_linear_3264_14377)"
          fillOpacity={0.24}
        />
        <path
          d="M292.152 46L255 83.1523L217.848 46L255 8.84766L292.152 46Z"
          stroke="url(#paint11_linear_3264_14377)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M255 -72L291 -34L255 4L217 -34L255 -72Z"
          fill="url(#paint12_linear_3264_14377)"
          fillOpacity={0.48}
        />
        <path
          d="M290.173 -34L254.987 3.13965L217.848 -34L254.987 -71.1406L290.173 -34Z"
          stroke="url(#paint13_linear_3264_14377)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M333 -72L369 -34L333 4L295 -34L333 -72Z"
          fill="url(#paint14_linear_3264_14377)"
          fillOpacity={0.48}
        />
        <path
          d="M368.173 -34L332.987 3.13965L295.848 -34L332.987 -71.1406L368.173 -34Z"
          stroke="url(#paint15_linear_3264_14377)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M215 50L253 86L215 124L177 86L215 50Z"
          fill="url(#paint16_linear_3264_14377)"
          fillOpacity={0.48}
        />
        <path
          d="M252.14 86.0117L215 123.152L177.859 86.0117L215 50.8262L252.14 86.0117Z"
          stroke="url(#paint17_linear_3264_14377)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M215 -32L251 6L215 44L179 6L215 -32Z"
          fill="url(#paint18_linear_3264_14377)"
          fillOpacity={0.48}
        />
        <path
          d="M250.173 6L215 43.127L179.826 6L215 -31.1279L250.173 6Z"
          stroke="url(#paint19_linear_3264_14377)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M15 8L53 46L15 84L-21 46L15 8Z"
          fill="url(#paint20_linear_3264_14377)"
          fillOpacity={0.64}
        />
        <path
          d="M52.1523 46L15.0117 83.1396L-20.1738 46L15.0117 8.85938L52.1523 46Z"
          stroke="url(#paint21_linear_3264_14377)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M335 8L373 46L335 84L297 46L335 8Z"
          fill="url(#paint22_linear_3264_14377)"
          fillOpacity={0.64}
        />
        <path
          d="M372.152 46L335 83.1523L297.848 46L335 8.84766L372.152 46Z"
          stroke="url(#paint23_linear_3264_14377)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M295 48L333 86L295 124L257 86L295 48Z"
          fill="url(#paint24_linear_3264_14377)"
          fillOpacity={0.48}
        />
        <path
          d="M332.152 86L295 123.152L257.848 86L295 48.8477L332.152 86Z"
          stroke="url(#paint25_linear_3264_14377)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M295 -32L333 6L293 42L257 6L295 -32Z"
          fill="url(#paint26_linear_3264_14377)"
          fillOpacity={0.48}
        />
        <path
          d="M332.128 5.97559L293.021 41.1729L257.848 6L295 -31.1523L332.128 5.97559Z"
          stroke="url(#paint27_linear_3264_14377)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M373 -32L411 6L371 42L335 6L373 -32Z"
          fill="url(#paint28_linear_3264_14377)"
          fillOpacity={0.64}
        />
        <path
          d="M410.128 5.97559L371.021 41.1729L335.848 6L373 -31.1523L410.128 5.97559Z"
          stroke="url(#paint29_linear_3264_14377)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M95 8L133 46L95 84L57 46L95 8Z"
          fill="url(#paint30_linear_3264_14377)"
          fillOpacity={0.48}
        />
        <path
          d="M132.152 46L95 83.1523L57.8477 46L95 8.84766L132.152 46Z"
          stroke="url(#paint31_linear_3264_14377)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M95 -72L133 -34L95 2L57 -34L95 -72Z"
          fill="url(#paint32_linear_3264_14377)"
          fillOpacity={0.48}
        />
        <path
          d="M132.14 -34.0127L95 1.17285L57.8594 -34.0127L95 -71.1523L132.14 -34.0127Z"
          stroke="url(#paint33_linear_3264_14377)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M13 -72L51 -34L13 2L-25 -34L13 -72Z"
          fill="url(#paint34_linear_3264_14377)"
          fillOpacity={0.48}
        />
        <path
          d="M50.1396 -34.0127L13 1.17285L-24.1406 -34.0127L13 -71.1523L50.1396 -34.0127Z"
          stroke="url(#paint35_linear_3264_14377)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M55 48L91 86L55 124L17 86L55 48Z"
          fill="url(#paint36_linear_3264_14377)"
          fillOpacity={0.48}
        />
        <path
          d="M90.1729 86L54.9873 123.14L17.8477 86L54.9873 48.8594L90.1729 86Z"
          stroke="url(#paint37_linear_3264_14377)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M55 -32L93 6L57 42L17 6L55 -32Z"
          fill="url(#paint38_linear_3264_14377)"
          fillOpacity={0.48}
        />
        <path
          d="M92.1523 6L56.9785 41.1729L17.8711 5.97559L55 -31.1523L92.1523 6Z"
          stroke="url(#paint39_linear_3264_14377)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M-27 -32L11 6L-25 42L-65 6L-27 -32Z"
          fill="url(#paint40_linear_3264_14377)"
          fillOpacity={0.48}
        />
        <path
          d="M10.1523 6L-25.0215 41.1729L-64.1289 5.97559L-27 -31.1523L10.1523 6Z"
          stroke="url(#paint41_linear_3264_14377)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
      </g>
    </g>
    <g filter="url(#filter1_i_3264_14377)">
      <path
        d="M342 8V84L330 92H12L0 84V8L12 0H120L124 4H218L222 0H330L342 8Z"
        fill="url(#paint42_linear_3264_14377)"
        fillOpacity={0.08}
      />
    </g>
    <path
      d="M119.793 0.5L123.793 4.5H218.207L222.207 0.5H329.849L341.5 8.26758V83.7324L329.849 91.5H12.1514L0.5 83.7324V8.26758L12.1514 0.5H119.793Z"
      stroke="url(#paint43_linear_3264_14377)"
    />
    <path
      d="M210 24H341V68H210V24Z"
      fill="url(#paint44_linear_3264_14377)"
      fillOpacity={0.6}
    />
    <text
      fill="#F4F7FF"
      xmlSpace="preserve"
      style={{
        whiteSpace: "pre",
      }}
      fontFamily="Cairo"
      fontSize={16}
      fontWeight="bold"
      letterSpacing="0em"
    >
      <tspan x={92} y={39.856}>
        {player.gameID}
      </tspan>
    </text>
    <text
      fill="#8598F6"
      xmlSpace="preserve"
      style={{
        whiteSpace: "pre",
      }}
      fontFamily="Cairo"
      fontSize={14}
      fontWeight={500}
      letterSpacing="0em"
    >
      <tspan x={92} y={65.124}>
        {`@${player.username}`}
      </tspan>
    </text>
    <path
      d="M24 12C28.5508 12 32.5097 14.5334 34.5439 18.2666C38.0739 16.8068 41.9426 16 46 16C62.5685 16 76 29.4315 76 46C76 62.5685 62.5685 76 46 76C29.4315 76 16 62.5685 16 46C16 41.9426 16.8068 38.0739 18.2666 34.5439C14.5334 32.5097 12 28.5508 12 24C12 17.3726 17.3726 12 24 12Z"
      fill="url(#paint45_radial_3264_14377)"
      fillOpacity={0.6}
    />
    <g filter="url(#filter2_d_3264_14377)">
      <path
        d="M46 22C59.2548 22 70 32.7452 70 46C70 59.2548 59.2548 70 46 70C32.7452 70 22 59.2548 22 46C22 42.43 22.7797 39.0421 24.1777 35.9971C30.664 35.9029 35.9029 30.664 35.9971 24.1777C39.0421 22.7797 42.43 22 46 22Z"
        fill={`url(#pattern0_3264_14377${player.index})`}
        shapeRendering="crispEdges"
      />
    </g>
    <mask
      id="mask1_3264_14377"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={16}
      y={16}
      width={16}
      height={16}
    >
      <rect
        x={16}
        y={16}
        width={16}
        height={16}
        fill="url(#pattern1_3264_14377)"
      />
    </mask>
    <g mask="url(#mask1_3264_14377)">
      <rect x={16} y={16} width={16} height={16} fill={getColor(player.rep)} />
    </g>
    
      <text
        fill="#fff"
        xmlSpace="preserve"
        style={{
          whiteSpace: "pre",
        }}
        textAnchor="end"
        fontFamily="Cairo"
        fontSize={22}
        fontWeight="bold"
        letterSpacing="0em"
      >
        <tspan x={320} y={52.052}>
          {player.score}
        </tspan>
      </text>
    
    <defs>
      <clipPath id="bgblur_0_3264_14377_clip_path" transform="translate(48 48)">
        <path d="M342 8V84L330 92H12L0 84V8L12 0H120L124 4H218L222 0H330L342 8Z" />
      </clipPath>
      <filter
        id="filter1_i_3264_14377"
        x={0}
        y={0}
        width={346}
        height={92}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx={4} />
        <feGaussianBlur stdDeviation={6} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.0114183 0 0 0 0 0.0237149 0 0 0 0 0.0913462 0 0 0 0.4 0"
        />
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_3264_14377"
        />
      </filter>
      <filter
        id="filter2_d_3264_14377"
        x={20}
        y={22}
        width={52}
        height={52}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={2} />
        <feGaussianBlur stdDeviation={1} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0.00392157 0 0 0 0 0.0235294 0 0 0 0.24 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3264_14377"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_3264_14377"
          result="shape"
        />
      </filter>
      <pattern
        id={`pattern0_3264_14377${player.index}`}
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <use
          xlinkHref={`#image0_3264_14377${player.index}`}
          transform="translate(0 -0.0503401) scale(0.00136054)"
        />
      </pattern>
      <pattern
        id="pattern1_3264_14377"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <use xlinkHref="#image1_3264_14377" transform="scale(0.0078125)" />
      </pattern>
      <filter
        id="filter3_d_3264_14377"
        x={221.106}
        y={17.2159}
        width={123.559}
        height={63.026}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={12} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.0117647 0 0 0 0 0.0235294 0 0 0 0 0.0901961 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3264_14377"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_3264_14377"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_3264_14377"
        x1={0}
        y1={46}
        x2={342}
        y2={46}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2743DD" />
        <stop offset={1} stopColor="#3A4EBF" stopOpacity={0.4} />
      </linearGradient>
      <linearGradient
        id="paint1_linear_3264_14377"
        x1={0}
        y1={46}
        x2={342}
        y2={46}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#D9D9D9" stopOpacity={0.2} />
        <stop offset={1} stopColor="#D9D9D9" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_3264_14377"
        x1={123.25}
        y1={101.459}
        x2={105.725}
        y2={-12.2986}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint3_linear_3264_14377"
        x1={145.73}
        y1={0.999999}
        x2={158.197}
        y2={58.6633}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint4_linear_3264_14377"
        x1={147.25}
        y1={-46.75}
        x2={256}
        y2={-77}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint5_linear_3264_14377"
        x1={196.75}
        y1={-72}
        x2={173}
        y2={-24.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint6_linear_3264_14377"
        x1={97}
        y1={103}
        x2={63.1327}
        y2={27.3397}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint7_linear_3264_14377"
        x1={105.73}
        y1={41}
        x2={118.197}
        y2={98.6633}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint8_linear_3264_14377"
        x1={108.98}
        y1={-6.75}
        x2={215.265}
        y2={-35.5362}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint9_linear_3264_14377"
        x1={157.178}
        y1={-32}
        x2={133.05}
        y2={14.9852}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint10_linear_3264_14377"
        x1={227.25}
        y1={33.25}
        x2={336}
        y2={3}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint11_linear_3264_14377"
        x1={276.75}
        y1={8}
        x2={253}
        y2={55.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint12_linear_3264_14377"
        x1={226.98}
        y1={-46.75}
        x2={333.265}
        y2={-75.5362}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint13_linear_3264_14377"
        x1={275.178}
        y1={-72}
        x2={251.05}
        y2={-25.0148}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint14_linear_3264_14377"
        x1={304.98}
        y1={-46.75}
        x2={411.265}
        y2={-75.5362}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint15_linear_3264_14377"
        x1={353.178}
        y1={-72}
        x2={329.05}
        y2={-25.0148}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint16_linear_3264_14377"
        x1={177}
        y1={103.553}
        x2={144.611}
        y2={29.2391}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint17_linear_3264_14377"
        x1={185.73}
        y1={43.1842}
        x2={197.577}
        y2={99.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint18_linear_3264_14377"
        x1={188.711}
        y1={-6.75}
        x2={292.501}
        y2={-34.1009}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint19_linear_3264_14377"
        x1={235.605}
        y1={-32}
        x2={211.096}
        y2={14.4393}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint20_linear_3264_14377"
        x1={-21}
        y1={63}
        x2={-55.4674}
        y2={-11.9747}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint21_linear_3264_14377"
        x1={-12.5}
        y1={0.999999}
        x2={0.272636}
        y2={58.5225}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint22_linear_3264_14377"
        x1={307.25}
        y1={33.25}
        x2={416}
        y2={3}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint23_linear_3264_14377"
        x1={356.75}
        y1={8}
        x2={333}
        y2={55.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint24_linear_3264_14377"
        x1={257}
        y1={103}
        x2={223.133}
        y2={27.3397}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint25_linear_3264_14377"
        x1={265.73}
        y1={41}
        x2={278.197}
        y2={98.6633}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint26_linear_3264_14377"
        x1={243.25}
        y1={59}
        x2={226.615}
        y2={-51.898}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint27_linear_3264_14377"
        x1={265.73}
        y1={-38.8158}
        x2={277.577}
        y2={17.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint28_linear_3264_14377"
        x1={335}
        y1={21.5526}
        x2={302.611}
        y2={-52.7609}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint29_linear_3264_14377"
        x1={343.73}
        y1={-38.8158}
        x2={355.577}
        y2={17.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint30_linear_3264_14377"
        x1={67.25}
        y1={33.25}
        x2={176}
        y2={3}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint31_linear_3264_14377"
        x1={116.75}
        y1={8}
        x2={93}
        y2={55.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint32_linear_3264_14377"
        x1={43.25}
        y1={19}
        x2={26.6148}
        y2={-91.898}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint33_linear_3264_14377"
        x1={65.7297}
        y1={-78.8158}
        x2={77.5766}
        y2={-22.5395}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint34_linear_3264_14377"
        x1={-38.75}
        y1={19}
        x2={-55.3852}
        y2={-91.898}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint35_linear_3264_14377"
        x1={-16.2703}
        y1={-78.8158}
        x2={-4.42337}
        y2={-22.5395}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint36_linear_3264_14377"
        x1={26.9803}
        y1={73.25}
        x2={133.265}
        y2={44.4638}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint37_linear_3264_14377"
        x1={75.1776}
        y1={48}
        x2={51.0501}
        y2={94.9852}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint38_linear_3264_14377"
        x1={17}
        y1={21.5526}
        x2={-15.3891}
        y2={-52.7609}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint39_linear_3264_14377"
        x1={25.7297}
        y1={-38.8158}
        x2={37.5766}
        y2={17.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint40_linear_3264_14377"
        x1={-65}
        y1={21.5526}
        x2={-97.3891}
        y2={-52.7609}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint41_linear_3264_14377"
        x1={-56.2703}
        y1={-38.8158}
        x2={-44.4234}
        y2={17.4605}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint42_linear_3264_14377"
        x1={0}
        y1={46}
        x2={342}
        y2={46}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2743DD" />
        <stop offset={1} stopColor="#3A4EBF" stopOpacity={0.4} />
      </linearGradient>
      <linearGradient
        id="paint43_linear_3264_14377"
        x1={0}
        y1={46}
        x2={342}
        y2={46}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8391EF" />
        <stop offset={0.475527} stopColor="#6474D9" stopOpacity={0} />
        <stop offset={1} stopColor="#6474D9" stopOpacity={0.24} />
      </linearGradient>
      <linearGradient
        id="paint44_linear_3264_14377"
        x1={210}
        y1={45.5892}
        x2={324.943}
        y2={46.2876}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#7285FF" stopOpacity={0} />
        <stop offset={1} stopColor="#7285FF" stopOpacity={0.4} />
      </linearGradient>
      <radialGradient
        id="paint45_radial_3264_14377"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(48 48) rotate(90) scale(38 38)"
      >
        <stop offset={0.319715} stopColor="#0D0D28" stopOpacity={0} />
        <stop offset={1} stopColor="#0D0D28" />
      </radialGradient>
      <linearGradient
        id="paint46_linear_3264_14377"
        x1={282.536}
        y1={32}
        x2={282.345}
        y2={55.9991}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.601585} stopColor="#E0DDFF" />
        <stop offset={0.923372} stopColor="#989DFF" />
      </linearGradient>
      <image
        id={`image0_3264_14377${player.index}`}
        width={735}
        height={809}
        preserveAspectRatio="none"
        xlinkHref={player.profilePic}
      />
      <image
        id="image1_3264_14377"
        width={128}
        height={128}
        preserveAspectRatio="none"
        xlinkHref={getSmile(player.rep)}
      />
    </defs>
  </svg>
);
export const mobileViewCard_Last_even = ({ player }) => (

  <svg
    width={344}
    height={97}
    viewBox="0 0 344 97"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"         
  >
    <foreignObject x={-47.9335} y={-47.7109} width={438} height={192}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          //backdropFilter: "blur(24px)",
          clipPath: "url(#bgblur_0_5060_2401_clip_path)",
          height: "100%",
          width: "100%",
        }}
      />
    </foreignObject>
    <path
      data-figma-bg-blur-radius={48}
      d="M214.066 96.2891H128.066H124.066H12.0665L0.0664673 88.2891V12.2891L12.0665 4.28906H124.066L128.066 0.289062H214.066L218.066 4.28906H330.066L342.066 12.2891V88.2891L330.066 96.2891H218.066H214.066Z"
      fill="url(#paint0_linear_5060_2401)"
      fillOpacity={0.4}
    />
    <mask
      id="mask0_5060_2401"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={343}
      height={97}
    >
      <path
        d="M342.066 12.2891V88.2891L330.066 96.2891H12.0665L0.0664673 88.2891V12.2891L12.0665 4.28906H124.066L128.066 0.289062H214.066L218.066 4.28906H330.066L342.066 12.2891Z"
        fill="url(#paint1_linear_5060_2401)"
      />
    </mask>
    <g mask="url(#mask0_5060_2401)">
      <g
        style={{
          mixBlendMode: "luminosity",
        }}
      >
        <path
          d="M175.066 8.28906L213.066 46.2891L175.066 84.2891L137.066 46.2891L175.066 8.28906Z"
          fill="url(#paint2_linear_5060_2401)"
          fillOpacity={0.32}
        />
        <path
          d="M212.219 46.2891L175.066 83.4414L137.914 46.2891L175.066 9.13672L212.219 46.2891Z"
          stroke="url(#paint3_linear_5060_2401)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M175.066 -71.7109L213.066 -33.7109L175.066 4.28906L137.066 -33.7109L175.066 -71.7109Z"
          fill="url(#paint4_linear_5060_2401)"
          fillOpacity={0.48}
        />
        <path
          d="M212.219 -33.7109L175.066 3.44141L137.914 -33.7109L175.066 -70.8633L212.219 -33.7109Z"
          stroke="url(#paint5_linear_5060_2401)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M135.066 48.2891L173.066 86.2891L135.066 124.289L97.0665 86.2891L135.066 48.2891Z"
          fill="url(#paint6_linear_5060_2401)"
          fillOpacity={0.48}
        />
        <path
          d="M172.219 86.2891L135.066 123.441L97.9141 86.2891L135.066 49.1367L172.219 86.2891Z"
          stroke="url(#paint7_linear_5060_2401)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M135.066 -31.7109L173.066 6.28906L135.066 44.2891L99.0665 6.28906L135.066 -31.7109Z"
          fill="url(#paint8_linear_5060_2401)"
          fillOpacity={0.48}
        />
        <path
          d="M172.219 6.28906L135.078 43.4287L99.8926 6.28906L135.078 -30.8516L172.219 6.28906Z"
          stroke="url(#paint9_linear_5060_2401)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M255.066 8.28906L293.066 46.2891L255.066 84.2891L217.066 46.2891L255.066 8.28906Z"
          fill="url(#paint10_linear_5060_2401)"
          fillOpacity={0.24}
        />
        <path
          d="M292.219 46.2891L255.066 83.4414L217.914 46.2891L255.066 9.13672L292.219 46.2891Z"
          stroke="url(#paint11_linear_5060_2401)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M255.066 -71.7109L291.066 -33.7109L255.066 4.28906L217.066 -33.7109L255.066 -71.7109Z"
          fill="url(#paint12_linear_5060_2401)"
          fillOpacity={0.48}
        />
        <path
          d="M290.239 -33.7109L255.054 3.42871L217.914 -33.7109L255.054 -70.8516L290.239 -33.7109Z"
          stroke="url(#paint13_linear_5060_2401)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M333.066 -71.7109L369.066 -33.7109L333.066 4.28906L295.066 -33.7109L333.066 -71.7109Z"
          fill="url(#paint14_linear_5060_2401)"
          fillOpacity={0.48}
        />
        <path
          d="M368.239 -33.7109L333.054 3.42871L295.914 -33.7109L333.054 -70.8516L368.239 -33.7109Z"
          stroke="url(#paint15_linear_5060_2401)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M215.066 50.2891L253.066 86.2891L215.066 124.289L177.066 86.2891L215.066 50.2891Z"
          fill="url(#paint16_linear_5060_2401)"
          fillOpacity={0.48}
        />
        <path
          d="M252.206 86.3008L215.066 123.441L177.926 86.3008L215.066 51.1152L252.206 86.3008Z"
          stroke="url(#paint17_linear_5060_2401)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M215.066 -31.7109L251.066 6.28906L215.066 44.2891L179.066 6.28906L215.066 -31.7109Z"
          fill="url(#paint18_linear_5060_2401)"
          fillOpacity={0.48}
        />
        <path
          d="M250.239 6.28906L215.066 43.416L179.893 6.28906L215.066 -30.8389L250.239 6.28906Z"
          stroke="url(#paint19_linear_5060_2401)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M15.0665 8.28906L53.0665 46.2891L15.0665 84.2891L-20.9335 46.2891L15.0665 8.28906Z"
          fill="url(#paint20_linear_5060_2401)"
          fillOpacity={0.64}
        />
        <path
          d="M52.2188 46.2891L15.0782 83.4287L-20.1074 46.2891L15.0782 9.14844L52.2188 46.2891Z"
          stroke="url(#paint21_linear_5060_2401)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M335.066 8.28906L373.066 46.2891L335.066 84.2891L297.066 46.2891L335.066 8.28906Z"
          fill="url(#paint22_linear_5060_2401)"
          fillOpacity={0.64}
        />
        <path
          d="M372.219 46.2891L335.066 83.4414L297.914 46.2891L335.066 9.13672L372.219 46.2891Z"
          stroke="url(#paint23_linear_5060_2401)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M295.066 48.2891L333.066 86.2891L295.066 124.289L257.066 86.2891L295.066 48.2891Z"
          fill="url(#paint24_linear_5060_2401)"
          fillOpacity={0.48}
        />
        <path
          d="M332.219 86.2891L295.066 123.441L257.914 86.2891L295.066 49.1367L332.219 86.2891Z"
          stroke="url(#paint25_linear_5060_2401)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M295.066 -31.7109L333.066 6.28906L293.066 42.2891L257.066 6.28906L295.066 -31.7109Z"
          fill="url(#paint26_linear_5060_2401)"
          fillOpacity={0.48}
        />
        <path
          d="M332.194 6.26465L293.087 41.4619L257.914 6.28906L295.066 -30.8633L332.194 6.26465Z"
          stroke="url(#paint27_linear_5060_2401)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M373.066 -31.7109L411.066 6.28906L371.066 42.2891L335.066 6.28906L373.066 -31.7109Z"
          fill="url(#paint28_linear_5060_2401)"
          fillOpacity={0.64}
        />
        <path
          d="M410.194 6.26465L371.087 41.4619L335.914 6.28906L373.066 -30.8633L410.194 6.26465Z"
          stroke="url(#paint29_linear_5060_2401)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M95.0665 8.28906L133.066 46.2891L95.0665 84.2891L57.0665 46.2891L95.0665 8.28906Z"
          fill="url(#paint30_linear_5060_2401)"
          fillOpacity={0.48}
        />
        <path
          d="M132.219 46.2891L95.0665 83.4414L57.9141 46.2891L95.0665 9.13672L132.219 46.2891Z"
          stroke="url(#paint31_linear_5060_2401)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M95.0665 -71.7109L133.066 -33.7109L95.0665 2.28906L57.0665 -33.7109L95.0665 -71.7109Z"
          fill="url(#paint32_linear_5060_2401)"
          fillOpacity={0.48}
        />
        <path
          d="M132.206 -33.7236L95.0665 1.46191L57.9258 -33.7236L95.0665 -70.8633L132.206 -33.7236Z"
          stroke="url(#paint33_linear_5060_2401)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M13.0665 -71.7109L51.0665 -33.7109L13.0665 2.28906L-24.9335 -33.7109L13.0665 -71.7109Z"
          fill="url(#paint34_linear_5060_2401)"
          fillOpacity={0.48}
        />
        <path
          d="M50.2061 -33.7236L13.0665 1.46191L-24.0742 -33.7236L13.0665 -70.8633L50.2061 -33.7236Z"
          stroke="url(#paint35_linear_5060_2401)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M55.0665 48.2891L91.0665 86.2891L55.0665 124.289L17.0665 86.2891L55.0665 48.2891Z"
          fill="url(#paint36_linear_5060_2401)"
          fillOpacity={0.48}
        />
        <path
          d="M90.2393 86.2891L55.0538 123.429L17.9141 86.2891L55.0538 49.1484L90.2393 86.2891Z"
          stroke="url(#paint37_linear_5060_2401)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M55.0665 -31.7109L93.0665 6.28906L57.0665 42.2891L17.0665 6.28906L55.0665 -31.7109Z"
          fill="url(#paint38_linear_5060_2401)"
          fillOpacity={0.48}
        />
        <path
          d="M92.2188 6.28906L57.045 41.4619L17.9376 6.26465L55.0665 -30.8633L92.2188 6.28906Z"
          stroke="url(#paint39_linear_5060_2401)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
        <path
          d="M-26.9335 -31.7109L11.0665 6.28906L-24.9335 42.2891L-64.9335 6.28906L-26.9335 -31.7109Z"
          fill="url(#paint40_linear_5060_2401)"
          fillOpacity={0.48}
        />
        <path
          d="M10.2188 6.28906L-24.955 41.4619L-64.0624 6.26465L-26.9335 -30.8633L10.2188 6.28906Z"
          stroke="url(#paint41_linear_5060_2401)"
          strokeOpacity={0.08}
          strokeWidth={1.2}
        />
      </g>
    </g>
    <g filter="url(#filter1_i_5060_2401)">
      <path
        d="M214.066 96.2891H128.066H124.066H12.0665L0.0664673 88.2891V12.2891L12.0665 4.28906H124.066L128.066 0.289062H214.066L218.066 4.28906H330.066L342.066 12.2891V88.2891L330.066 96.2891H218.066H214.066Z"
        fill="url(#paint42_linear_5060_2401)"
        fillOpacity={0.08}
      />
    </g>
    <path
      d="M213.859 0.789062L217.859 4.78906H329.915L341.566 12.5566V88.0215L329.915 95.7891H12.2178L0.566467 88.0215V12.5566L12.2178 4.78906H124.273L128.273 0.789062H213.859Z"
      stroke="url(#paint43_linear_5060_2401)"
    />
    <path
      d="M24.0665 16.2891C28.6173 16.2891 32.5761 18.8224 34.6104 22.5557C38.1404 21.0959 42.0091 20.2891 46.0665 20.2891C62.635 20.2891 76.0665 33.7205 76.0665 50.2891C76.0665 66.8576 62.635 80.2891 46.0665 80.2891C29.4979 80.2891 16.0665 66.8576 16.0665 50.2891C16.0665 46.2317 16.8733 42.363 18.3331 38.833C14.5998 36.7987 12.0665 32.8399 12.0665 28.2891C12.0665 21.6616 17.4391 16.2891 24.0665 16.2891Z"
      fill="url(#paint44_radial_5060_2401)"
      fillOpacity={0.6}
    />
    <g filter="url(#filter2_d_5060_2401)">
      <path
        d="M46.0665 26.2891C59.3213 26.2891 70.0665 37.0342 70.0665 50.2891C70.0665 63.5439 59.3213 74.2891 46.0665 74.2891C32.8116 74.2891 22.0665 63.5439 22.0665 50.2891C22.0665 46.719 22.8461 43.3311 24.2442 40.2861C30.7305 40.1919 35.9694 34.9531 36.0635 28.4668C39.1085 27.0687 42.4964 26.2891 46.0665 26.2891Z"
        fill={`url(#pattern0_5060_2401${player.index})`}
        shapeRendering="crispEdges"
      />
    </g>
    <mask
      id="mask1_5060_2401"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={16}
      y={20}
      width={17}
      height={17}
    >
      <rect
        x={16.0665}
        y={20.2891}
        width={16}
        height={16}
        fill="url(#pattern1_5060_2401)"
      />
    </mask>
    <g mask="url(#mask1_5060_2401)">
      <rect x={16.0665} y={20.2891} width={16} height={16} fill={getColor(player.rep)} />
    </g>
    <path
      d="M210.066 28.2891H341.066V72.2891H210.066V28.2891Z"
      fill="url(#paint45_linear_5060_2401)"
      fillOpacity={0.6}
    />
    <text
      fill="#F4F7FF"
      xmlSpace="preserve"
      style={{
        whiteSpace: "pre",
      }}
      fontFamily="Cairo"
      fontSize={16}
      fontWeight="bold"
      letterSpacing="0em"
    >
      <tspan x={92.0665} y={44.1451}>
        {player.gameID}
      </tspan>
    </text>
    <text
      fill="#8598F6"
      xmlSpace="preserve"
      style={{
        whiteSpace: "pre",
      }}
      fontFamily="Cairo"
      fontSize={14}
      fontWeight={500}
      letterSpacing="0em"
    >
      <tspan x={92.0665} y={69.4131}>
        {`@${player.username}`}
      </tspan>
    </text>
    
      <text
        fill="#fff"
        xmlSpace="preserve"
        style={{
          whiteSpace: "pre",
        }}
        textAnchor="end"
        fontFamily="Cairo"
        fontSize={22}
        fontWeight="bold"
        letterSpacing="0em"
      >
        <tspan x={320} y={56.3411}>
          {player.score}
        </tspan>
      </text>
    
    <defs>
      <clipPath
        id="bgblur_0_5060_2401_clip_path"
        transform="translate(47.9335 47.7109)"
      >
        <path d="M214.066 96.2891H128.066H124.066H12.0665L0.0664673 88.2891V12.2891L12.0665 4.28906H124.066L128.066 0.289062H214.066L218.066 4.28906H330.066L342.066 12.2891V88.2891L330.066 96.2891H218.066H214.066Z" />
      </clipPath>
      <filter
        id="filter1_i_5060_2401"
        x={0.0664673}
        y={0.289062}
        width={346}
        height={96}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx={4} />
        <feGaussianBlur stdDeviation={6} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.0114183 0 0 0 0 0.0237149 0 0 0 0 0.0913462 0 0 0 0.4 0"
        />
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_5060_2401"
        />
      </filter>
      <filter
        id="filter2_d_5060_2401"
        x={20.0665}
        y={26.2891}
        width={52}
        height={52}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={2} />
        <feGaussianBlur stdDeviation={1} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0.00392157 0 0 0 0 0.0235294 0 0 0 0.24 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_5060_2401"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_5060_2401"
          result="shape"
        />
      </filter>
      <pattern
        id={`pattern0_5060_2401${player.index}`}
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <use
          xlinkHref={`#image0_5060_2401${player.index}`}
          transform="translate(0 -0.0503401) scale(0.00136054)"
        />
      </pattern>
      <pattern
        id="pattern1_5060_2401"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <use xlinkHref="#image1_5060_2401" transform="scale(0.0078125)" />
      </pattern>
      <filter
        id="filter3_d_5060_2401"
        x={221.173}
        y={21.5051}
        width={121.887}
        height={63.0259}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={12} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.0117647 0 0 0 0 0.0235294 0 0 0 0 0.0901961 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_5060_2401"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_5060_2401"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_5060_2401"
        x1={0.0664673}
        y1={50.2891}
        x2={342.066}
        y2={50.2891}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2743DD" />
        <stop offset={1} stopColor="#3A4EBF" stopOpacity={0.4} />
      </linearGradient>
      <linearGradient
        id="paint1_linear_5060_2401"
        x1={0.0664673}
        y1={48.2891}
        x2={342.066}
        y2={48.2891}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#D9D9D9" stopOpacity={0.2} />
        <stop offset={1} stopColor="#D9D9D9" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_5060_2401"
        x1={123.316}
        y1={101.749}
        x2={105.791}
        y2={-12.0096}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint3_linear_5060_2401"
        x1={145.796}
        y1={1.28906}
        x2={158.263}
        y2={58.9523}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint4_linear_5060_2401"
        x1={147.316}
        y1={-46.4609}
        x2={256.066}
        y2={-76.7109}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint5_linear_5060_2401"
        x1={196.816}
        y1={-71.7109}
        x2={173.066}
        y2={-24.2109}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint6_linear_5060_2401"
        x1={97.0665}
        y1={103.289}
        x2={63.1992}
        y2={27.6287}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint7_linear_5060_2401"
        x1={105.796}
        y1={41.2891}
        x2={118.263}
        y2={98.9523}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint8_linear_5060_2401"
        x1={109.047}
        y1={-6.46094}
        x2={215.331}
        y2={-35.2472}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint9_linear_5060_2401"
        x1={157.244}
        y1={-31.7109}
        x2={133.117}
        y2={15.2743}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint10_linear_5060_2401"
        x1={227.316}
        y1={33.5391}
        x2={336.066}
        y2={3.28906}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint11_linear_5060_2401"
        x1={276.816}
        y1={8.28906}
        x2={253.066}
        y2={55.7891}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint12_linear_5060_2401"
        x1={227.047}
        y1={-46.4609}
        x2={333.331}
        y2={-75.2472}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint13_linear_5060_2401"
        x1={275.244}
        y1={-71.7109}
        x2={251.117}
        y2={-24.7257}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint14_linear_5060_2401"
        x1={305.047}
        y1={-46.4609}
        x2={411.331}
        y2={-75.2472}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint15_linear_5060_2401"
        x1={353.244}
        y1={-71.7109}
        x2={329.117}
        y2={-24.7257}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint16_linear_5060_2401"
        x1={177.066}
        y1={103.842}
        x2={144.677}
        y2={29.5282}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint17_linear_5060_2401"
        x1={185.796}
        y1={43.4733}
        x2={197.643}
        y2={99.7496}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint18_linear_5060_2401"
        x1={188.777}
        y1={-6.46094}
        x2={292.567}
        y2={-33.8118}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint19_linear_5060_2401"
        x1={235.672}
        y1={-31.7109}
        x2={211.162}
        y2={14.7284}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint20_linear_5060_2401"
        x1={-20.9335}
        y1={63.2891}
        x2={-55.401}
        y2={-11.6856}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint21_linear_5060_2401"
        x1={-12.4335}
        y1={1.28906}
        x2={0.339103}
        y2={58.8116}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint22_linear_5060_2401"
        x1={307.316}
        y1={33.5391}
        x2={416.066}
        y2={3.28906}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint23_linear_5060_2401"
        x1={356.816}
        y1={8.28906}
        x2={333.066}
        y2={55.7891}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint24_linear_5060_2401"
        x1={257.066}
        y1={103.289}
        x2={223.199}
        y2={27.6287}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint25_linear_5060_2401"
        x1={265.796}
        y1={41.2891}
        x2={278.263}
        y2={98.9523}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint26_linear_5060_2401"
        x1={243.316}
        y1={59.2891}
        x2={226.681}
        y2={-51.6089}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint27_linear_5060_2401"
        x1={265.796}
        y1={-38.5267}
        x2={277.643}
        y2={17.7496}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint28_linear_5060_2401"
        x1={335.066}
        y1={21.8417}
        x2={302.677}
        y2={-52.4718}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint29_linear_5060_2401"
        x1={343.796}
        y1={-38.5267}
        x2={355.643}
        y2={17.7496}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint30_linear_5060_2401"
        x1={67.3165}
        y1={33.5391}
        x2={176.066}
        y2={3.28906}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint31_linear_5060_2401"
        x1={116.816}
        y1={8.28906}
        x2={93.0665}
        y2={55.7891}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint32_linear_5060_2401"
        x1={43.3165}
        y1={19.2891}
        x2={26.6813}
        y2={-91.6089}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint33_linear_5060_2401"
        x1={65.7962}
        y1={-78.5267}
        x2={77.6431}
        y2={-22.2504}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint34_linear_5060_2401"
        x1={-38.6835}
        y1={19.2891}
        x2={-55.3187}
        y2={-91.6089}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.48} />
      </linearGradient>
      <linearGradient
        id="paint35_linear_5060_2401"
        x1={-16.2038}
        y1={-78.5267}
        x2={-4.35691}
        y2={-22.2504}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint36_linear_5060_2401"
        x1={27.0467}
        y1={73.5391}
        x2={133.331}
        y2={44.7528}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint37_linear_5060_2401"
        x1={75.2441}
        y1={48.2891}
        x2={51.1166}
        y2={95.2743}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint38_linear_5060_2401"
        x1={17.0665}
        y1={21.8417}
        x2={-15.3226}
        y2={-52.4718}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint39_linear_5060_2401"
        x1={25.7962}
        y1={-38.5267}
        x2={37.6431}
        y2={17.7496}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint40_linear_5060_2401"
        x1={-64.9335}
        y1={21.8417}
        x2={-97.3226}
        y2={-52.4718}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" stopOpacity={0} />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0.32} />
      </linearGradient>
      <linearGradient
        id="paint41_linear_5060_2401"
        x1={-56.2038}
        y1={-38.5267}
        x2={-44.3569}
        y2={17.7496}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5571FF" />
        <stop offset={1} stopColor="#5571FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="paint42_linear_5060_2401"
        x1={0.0664673}
        y1={50.2891}
        x2={342.066}
        y2={50.2891}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2743DD" />
        <stop offset={1} stopColor="#3A4EBF" stopOpacity={0.4} />
      </linearGradient>
      <linearGradient
        id="paint43_linear_5060_2401"
        x1={0.0664673}
        y1={50.2891}
        x2={342.066}
        y2={50.2891}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8391EF" />
        <stop offset={0.475527} stopColor="#6474D9" stopOpacity={0} />
        <stop offset={1} stopColor="#6474D9" stopOpacity={0.24} />
      </linearGradient>
      <radialGradient
        id="paint44_radial_5060_2401"
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(48.0665 52.2891) rotate(90) scale(38 38)"
      >
        <stop offset={0.319715} stopColor="#0D0D28" stopOpacity={0} />
        <stop offset={1} stopColor="#0D0D28" />
      </radialGradient>
      <linearGradient
        id="paint45_linear_5060_2401"
        x1={210.066}
        y1={49.8782}
        x2={325.009}
        y2={50.5767}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#7285FF" stopOpacity={0} />
        <stop offset={1} stopColor="#7285FF" stopOpacity={0.4} />
      </linearGradient>
      <linearGradient
        id="paint46_linear_5060_2401"
        x1={282.602}
        y1={36.2891}
        x2={282.412}
        y2={60.2881}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.601585} stopColor="#E0DDFF" />
        <stop offset={0.923372} stopColor="#989DFF" />
      </linearGradient>
      <image
        id={`image0_5060_2401${player.index}`}
        width={735}
        height={809}
        preserveAspectRatio="none"
        xlinkHref={player.profilePic}
      />
      <image
        id="image1_5060_2401"
        width={128}
        height={128}
        preserveAspectRatio="none"
        xlinkHref={getSmile(player.rep)}
      />
    </defs>
  </svg>
);


