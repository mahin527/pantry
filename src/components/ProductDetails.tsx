
import Rating from '@mui/material/Rating';
import { Button } from "@mui/material"

import { IoMdHeartEmpty } from "react-icons/io";
import Tooltip from '@mui/material/Tooltip';

import { RiShoppingBag3Line } from "react-icons/ri";
import QuantityBox from "./QuantityBox";

function ProductDetails() {

    return (
        <div className="py-3 w-[70%] space-y-8">
            <div>
                <h2 className="text-xl lg:text-2xl 2xl:text-3xl font-semibold text-gray-700">
                    Lay's American Style Cream & Onion Potato Chips 82 g
                </h2>
            </div>
            <div className="flex gap-4 items-center text-base 2xl:text-lg font-bold text-gray-600">
                <div>
                    Brand: <span>Bingo</span>
                </div>
                <div className="flex items-center gap-2">
                    <Rating name="read-only" value={5} readOnly />
                    <span>Review (0)</span>
                </div>

            </div>
            <div className="flex gap-5 items-center">
                <div className="flex items-center gap-3 text-lg xl:text-xl font-bold">
                    <p className="text-blue-500">
                        $24.09
                    </p>
                    <p className="text-gray-500 line-through">
                        $32.21
                    </p>
                </div>
                <div className="flex items-center gap-2 font-bold text-gray-600">
                    <span>Available in stock: </span>
                    <span>12,000 items</span>
                </div>
            </div>
            <div>
                <p className="text-base 2xl:text-lg font-bold text-gray-600 tracking-wider leading-7">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make
                    va type specimen book. Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took
                    a galley of type and scrambled it to make a type specimen book
                </p>
            </div>
            <div>
                <div className="flex items-center gap-3">
                    <QuantityBox />
                    <Button variant="contained" className="py-2.5! font-bold! space-x-2!">
                        <RiShoppingBag3Line size={26} /> Add to cart
                    </Button>
                    <Tooltip title="Add to wishlist" placement="top">
                        <Button className="rounde-md!">
                            <IoMdHeartEmpty size={34} />
                        </Button>
                    </Tooltip>

                </div>
            </div>
        </div>
    )
}

export default ProductDetails