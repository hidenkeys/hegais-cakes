"use client";

import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { stripHtml } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import ZoomImage from '@/components/zoom/zoom-image';
import Image from 'next/image';
import { GiCakeSlice } from 'react-icons/gi';
import { IoIosStarOutline } from "react-icons/io";

export type Product = {
    id: string;
    name: string;
    price: string;
    description: string;
    image1: string;
    image2: string;
    image3: string;
    image4: string;
    collectionId: string;
    collectionName: string;
    created: string;
    updated: string;
};

export default function TasterBoxProductDetails({ product }: { product: Product }) {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

    const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
    const [quantity, setQuantity] = useState<number>(1);
    const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

    // Load wishlist state on mount
    useEffect(() => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setIsWishlisted(wishlist.includes(product.id));
    }, [product.id]);

    const images = [
        product?.image1 || null,
        product?.image2 || null,
        product?.image3 || null,
        product?.image4 || null
    ].filter(Boolean) as string[];

    const [activeImage, setActiveImage] = useState<string | null>(images[0] || null);

    const flavors = [
        'Dulce de Leche',
        'Coconut & Lime',
        'Almond Sponge',
        'Blueberry & Pistachio',
        'Spiced Chocolate',
        'White Cream cake'
    ];

    const handleFlavorChange = (flavor: string) => {
        if (selectedFlavors.includes(flavor)) {
            setSelectedFlavors((f) => f.filter(x => x !== flavor));
        } else if (selectedFlavors.length < 4) {
            setSelectedFlavors((f) => [...f, flavor]);
        }
    };

    const handleWishlistToggle = () => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        
        if (isWishlisted) {
            // Remove from wishlist
            const updatedWishlist = wishlist.filter((id: string) => id !== product.id);
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
            setIsWishlisted(false);
            toast.success('Removed from wishlist');
        } else {
            // Add to wishlist
            const updatedWishlist = [...wishlist, product.id];
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
            setIsWishlisted(true);
            toast.success('Added to wishlist');
        }

        // Dispatch custom event to update header counter
        window.dispatchEvent(new Event('wishlistUpdated'));
    };

    // const nextImage = () => {
    //     setCurrentImageIndex((i) => (i + 1) % images.length);
    // };
    // const prevImage = () => {
    //     setCurrentImageIndex((i) => (i - 1 + images.length) % images.length);
    // };

    const handleAddToCart = () => {
        if (!product || selectedFlavors.length !== 4) return;

        const cartItem = {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            selectedFlavors,
            timestamp: new Date().toISOString()
        };

        // read existing cart, append, and save
        const existing = JSON.parse(localStorage.getItem('cart') || '[]');
        existing.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(existing));

        toast.success("Added to cart!");
    };

    return (
        <>
            <section>
                <div className='max-w-[75rem] mx-auto'>
                    <div className='pt-10 grid grid-cols-2 gap-x-8 gap-y-8 px-10 mb-10 max-[1000px]:grid-cols-1 max-[530px]:px-5'>
                        <div>
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    initial={{ opacity: 0.7 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0.7 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {activeImage && (
                                        <ZoomImage
                                            src={activeImage}
                                            width={800}
                                            height={470}
                                            alt={product?.name || ""}
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            <div className="grid grid-cols-3 gap-4 mt-5 max-[1000px]:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] max-[368px]:grid-cols-[repeat(4,140px)] max-[368px]:overflow-x-scroll scrollbar-hide">
                                {images.map((img, idx) => (
                                    img && (
                                        <button
                                            key={idx}
                                            type="button"
                                            tabIndex={0}
                                            onClick={() => setActiveImage(img)}
                                            className={`cursor-pointer transition-all duration-300 rounded-md overflow-hidden border-2 ${activeImage === img
                                                ? "border-[#145dff]"
                                                : "border-transparent"
                                                }`}
                                        >
                                            <div className="relative h-36">
                                                <Image
                                                    src={img}
                                                    alt={`Thumbnail ${idx + 1}`}
                                                    className="object-cover"
                                                    fill
                                                />
                                            </div>
                                        </button>
                                    )
                                ))}
                            </div>

                        </div>
                        <div className='space-y-5'>
                            <h1 className='text-5xl font-bold max-[530px]:text-4xl'>{product?.name}</h1>
                            <div className='flex items-center gap-x-4'>
                                <h3 className='text-[#277500] text-4xl font-semibold max-[530px]:text-3xl'>£ {Number.parseInt(product?.price || "0").toLocaleString()}</h3>
                                <p className='text-[#277500] text-xl'>Available</p>
                            </div>
                            <p className='text-xl leading-[1.8] text-[#50555C] max-[530px]:text-base'>
                                {stripHtml(product?.description || "")}
                            </p>
                            <div className='space-y-3   pb-10 border-b border-[#E0E0E0]'>
                                <p className='text-xl max-[530px]:text-lg'>4 slices, 8 servings</p>
                                <p className='text-base max-[530px]:text-sm'>PRE-ORDER for delivery on ____</p>
                            </div>
                            <div className='mt-4 text-[#50555C]'>
                                <h3 className='text-2xl font-medium mb-4 max-[530px]:text-xl'>Add a lovely gift note (optional)</h3>
                                <textarea className='w-full h-40 resize-none p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                            </div>
                            <div>
                                <h3 className="text-xl text-[#333333] mb-3 max-[530px]:text-lg">
                                    Pick any four (4) flavours
                                </h3>
                                <div className="space-y-3 text-[#333333]">
                                    {flavors.map((flavor) => (
                                        <label key={flavor} className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedFlavors.includes(flavor)}
                                                disabled={!selectedFlavors.includes(flavor) && selectedFlavors.length >= 4}
                                                onChange={() => handleFlavorChange(flavor)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                                            />
                                            <span className={`text-gray-700 ${!selectedFlavors.includes(flavor) && selectedFlavors.length >= 4
                                                ? 'opacity-50' : ''
                                                }`}>
                                                {flavor}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className='border-t border-[#E0E0E0] pt-4 grid grid-cols-[1fr_2fr_auto] gap-x-3 max-[483px]:grid-cols-[1fr_auto] max-[483px]:gap-y-3'>
                                <div className='border border-[#0F4C81] flex items-center justify-evenly py-3 px-1 rounded-full text-xl'>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className='cursor-pointer'
                                    >+</button>
                                    <span>{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity - 1)}
                                        className='cursor-pointer'
                                    >-</button>
                                </div>
                                <button
                                    onClick={handleWishlistToggle}
                                    className={`cursor-pointer hidden max-[483px]:flex w-14 justify-center items-center p-2 rounded-lg border transition-colors max-[483px]:col-start-2 ${isWishlisted
                                        ? 'bg-red-50 border-red-200 text-red-600'
                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                </button>
                                <button
                                    onClick={handleAddToCart}
                                    className="cursor-pointer bg-[#0F4C81] text-white px-4 py-4 rounded-full flex items-center justify-center gap-x-2 border border-current transition-all duration-300 hover:text-[#0F4C81] hover:bg-white hover:border-[#0F4C81] disabled:opacity-50 disabled:cursor-not-allowed max-[483px]:col-span-full"
                                    disabled={selectedFlavors.length !== 4}
                                >
                                    <ShoppingCart className='w-5 h-5' />
                                    <span> Add To Cart</span>
                                </button>
                                <button
                                    onClick={handleWishlistToggle}
                                    className={`cursor-pointer w-14 flex justify-center items-center p-2 rounded-lg border transition-colors max-[483px]:col-start-2 max-[483px]:hidden ${isWishlisted
                                        ? 'bg-red-50 border-red-200 text-red-600'
                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                </button>
                            </div>

                        </div>
                    </div>
                    <div className='border-y border-[#E0E0E0] py-5 mb-4 px-5'>
                        <h2 className='text-2xl font-bold text-[#333333]'>Sweet Words from Our Customers</h2>
                        <div className='flex flex-col gap-y-4 items-center mt-4 mb-6 text-[#D9D9D9]'>
                            <GiCakeSlice className='w-10 h-10' />
                            <p className='text-xl italic'>Oopsie! There are no reviews yet.</p>
                        </div>
                        <button
                            onClick={() => setIsReviewModalOpen(true)}
                            className='cursor-pointer w-full bg-[#0F4C81] text-white px-4 py-3 rounded-full flex items-center justify-center gap-x-2 border border-current transition-all duration-300 hover:text-[#0F4C81] hover:bg-white hover:border-[#0F4C81] disabled:opacity-50 disabled:cursor-not-allowed'>
                            <span>Leave A Review</span>
                        </button>
                    </div>
                </div>
            </section>
            {isReviewModalOpen && <ReviewModal setIsReviewModalOpen={setIsReviewModalOpen} product={product} />}
        </>
    );
}


const ReviewModal = ({
    setIsReviewModalOpen,
    product,
}: {
    setIsReviewModalOpen: (isOpen: boolean) => void,
    product: Product,
}) => {
    const [rating, setRating] = useState<number>(0);
    const [formData, setFormData] = useState({
        review: "",
        name: "",
        email: "",
        save_info: false
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (rating === 0) {
            newErrors.rating = "Please select a rating";
        }
        
        if (!formData.review.trim()) {
            newErrors.review = "Review comment is required";
        } else if (formData.review.trim().length < 10) {
            newErrors.review = "Review must be at least 10 characters";
        }
        
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }
        
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const reviewData = {
                product_id: product.id,
                rating,
                review: formData.review.trim(),
                name: formData.name.trim(),
                email: formData.email.trim(),
                save_info: formData.save_info
            };

            // Import the createReview function
            const { createReview } = await import('@/http');
            await createReview(reviewData);

            toast.success("Thank you for your review!");
            setIsReviewModalOpen(false);
            
            // Reset form
            setRating(0);
            setFormData({
                review: "",
                name: "",
                email: "",
                save_info: false
            });
            setErrors({});
            
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStarClick = (starRating: number) => {
        setRating(starRating);
        if (errors.rating) {
            setErrors(prev => ({ ...prev, rating: "" }));
        }
    };

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    return (
        <div className='fixed inset-0 bg-black/60 flex justify-center items-center z-[1000]'>
            <div className='max-w-[40rem] w-full py-6 px-7 bg-white max-[530px]:px-4 max-h-[90vh] overflow-y-auto'>
                <div className='relative flex items-start justify-between gap-x-7 max-[573px]:gap-x-0 max-[573px]:flex-col-reverse '>

                    <div className='flex-1'>
                        <h2 className='text-[#333333] font-bold text-xl max-[573px]:text-lg'>Tell Us About Your Cake Experience</h2>
                        <p className='text-[#50555C] mt-1 max-[573px]:text-sm'>
                            Tried our {product.name}? Leave a review and help others discover the sweetness!
                        </p>
                        <p className='text-[#CB0404] text-sm mt-2 max-[573px]:text-xs'>Required fields are marked *</p>
                        <p className='text-[#333333] text-sm mt-2 max-[573px]:text-xs'>
                            Your rating
                            <span className='text-[#CB0404]'>*</span>
                        </p>
                    </div>

                    <button 
                        type='button' 
                        className='cursor-pointer max-[573px]:self-end' 
                        onClick={() => setIsReviewModalOpen(false)}
                        disabled={isSubmitting}
                    >
                        <X className='w-5 h-5' />
                    </button>

                </div>
                
                {/* Star Rating */}
                <div className='flex items-center justify-center gap-x-8 mt-7'>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => handleStarClick(star)}
                            className="flex items-center gap-x-1 text-[#333333] hover:scale-110 transition-transform"
                            disabled={isSubmitting}
                        >
                            <div className='flex flex-col items-center gap-y-3'>
                                <IoIosStarOutline 
                                    size={40} 
                                    className={rating >= star ? 'text-yellow-400 fill-current' : ''}
                                />
                                <p>{star}</p>
                            </div>
                        </button>
                    ))}
                </div>
                {errors.rating && (
                    <p className="text-red-500 text-sm text-center mt-2">{errors.rating}</p>
                )}

                <form onSubmit={handleSubmit} className='mt-7 space-y-4'>
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="write_review">
                            <p>Write a review <span className='text-[#CB0404]'>*</span></p>
                        </label>
                        <textarea 
                            name="write_review" 
                            id="write_review" 
                            className={`w-full h-32 resize-none p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.comment ? 'border-red-500' : 'border-gray-300'}`}
                            value={formData.review}
                            onChange={(e) => handleInputChange('review', e.target.value)}
                            placeholder="Share your experience with this product..."
                            disabled={isSubmitting}
                        />
                        {errors.review && (
                            <p className="text-red-500 text-sm">{errors.review}</p>
                        )}
                    </div>
                    
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="name">
                            <p>Name <span className='text-[#CB0404]'>*</span></p>
                        </label>
                        <input 
                            type="text" 
                            name="name" 
                            id="name"
                            className={`w-full border py-2.5 px-3 rounded-md font-medium ${errors.name ? 'border-red-500' : 'border-[#D9D9D9]'}`}
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Your name"
                            disabled={isSubmitting}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name}</p>
                        )}
                    </div>
                    
                    <div className='flex flex-col gap-y-2'>
                        <label htmlFor="email">
                            <p>Email <span className='text-[#CB0404]'>*</span></p>
                        </label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email"
                            className={`w-full border py-2.5 px-3 rounded-md font-medium ${errors.email ? 'border-red-500' : 'border-[#D9D9D9]'}`}
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="your.email@example.com"
                            disabled={isSubmitting}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                    </div>
                    
                    <div className='flex gap-x-3 items-center'>
                        <input 
                            type="checkbox" 
                            name="terms" 
                            id="terms" 
                            className='size-5'
                            checked={formData.save_info}
                            onChange={(e) => handleInputChange('save_info', e.target.checked)}
                            disabled={isSubmitting}
                        />
                        <label htmlFor="terms" className='text-[#333333] text-base'>
                            Save my name, email address and website in this browser for the next time I comment
                        </label>
                    </div>
                    
                    <button 
                        type='submit' 
                        className='mt-4 cursor-pointer w-full bg-[#0F4C81] text-white py-4 px-3 rounded-full font-semibold text-lg border-2 border-current hover:bg-transparent hover:text-[#0F4C81] hover:border-[#0F4C81] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            </div>
        </div>
    )
}