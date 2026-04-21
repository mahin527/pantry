import Image from "next/image"
import profilePic1 from "../../public/profile-pic1.jpg"
import Rating from '@mui/material/Rating';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { Button } from "@mui/material";



function ProductReviews() {
    return (
        <section className="pt-2 w-[70%]">
            <div className="space-y-5">
                <div>
                    <h3 className="text-xl lg:text-2xl font-bold text-blue-500">Reviews(0)</h3>
                </div>
                <div>
                    <h5 className="text-base font-medium text-gray-700">Customer questions & answers</h5>
                </div>

                <div className="py-2">
                    <div className="flex items-center gap-4 w-full">
                        <Image src={profilePic1} alt="Mahin Hasan" height={100} width={100} className="rounded-full border border-gray-800 size-14 lg:size-16 object-cover" />
                        <div className="flex justify-between w-full">
                            <div>
                                <h6 className="font-bold text-gray-700">Mahin Hasan</h6>
                                <p className="text-xs lg:text-sm text-gray-600">
                                    2026-04-02
                                </p>
                            </div>
                            <Rating name="read-only" defaultValue={5} readOnly />
                        </div>
                    </div>
                    <div className="px-6 py-2">
                        <p className="text-xs lg:text-sm text-gray-600 tracking-wider leading-6 text-justify">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500. Lorem Ipsum is simply dummy text of the printing and typesetting
                            industry.
                        </p>
                    </div>
                </div>

                <div className="py-2">
                    <div className="flex items-center gap-4 w-full">
                        <Image src={profilePic1} alt="Mahin Hasan" height={100} width={100} className="rounded-full border border-gray-800 size-14 lg:size-16 object-cover" />
                        <div className="flex justify-between w-full">
                            <div>
                                <h6 className="font-bold text-gray-700">Mahin Hasan</h6>
                                <p className="text-xs lg:text-sm text-gray-600">
                                    2026-04-02
                                </p>
                            </div>
                            <Rating name="read-only" defaultValue={5} readOnly />
                        </div>
                    </div>
                    <div className="px-6 py-2">
                        <p className="text-xs lg:text-sm text-gray-600 tracking-wider leading-6 text-justify">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500. Lorem Ipsum is simply dummy text of the printing and typesetting
                            industry.
                        </p>
                    </div>
                </div>
            </div>

            <div className="py-3">
                <div className="pb-4 pt-1">
                    <h5 className="text-base font-medium text-gray-700">Add a review</h5>
                </div>
                <form className="space-y-3">
                    <TextareaAutosize
                        aria-label="add-a-riview"
                        id="add-a-riview"
                        minRows={8}
                        placeholder="Share your experience with this product (quality, freshness, taste, etc.)"
                        className="text-xs lg:text-sm bg-gray-100 w-100 md:w-150 lg:w-200 outline-none border border-gray-200 px-2 py-2 rounded-md text-gray-700! tracking-widest! leading-5 lg:leading-7!"
                    />
                    <div>
                        <Rating name="read-only" defaultValue={3} />
                    </div>
                    <Button variant="contained" className="font-bold!">
                        Submit Review
                    </Button>
                </form>
            </div>
        </section>
    )
}

export default ProductReviews