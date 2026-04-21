import ProductDetails from "./ProductDetails"
import ProductImage from "./ProductImage"
import ProductReviews from "./ProductReviews"
import RelatedProducts from "./RelatedProducts"

function ProductDetailsComponents() {
    return (
        <div className="space-y-5">
            <div className="flex gap-10">
                <ProductImage />
                <ProductDetails />
            </div>
            <ProductReviews />
            <RelatedProducts />
        </div>
    )
}

export default ProductDetailsComponents