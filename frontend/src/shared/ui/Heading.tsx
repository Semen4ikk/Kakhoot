import type {HeadingType} from "../types/headingTypes.ts";


export function Heading({title}: HeadingType) {
    return (
        <div>
            <h2>{title}</h2>
        </div>
    )
}