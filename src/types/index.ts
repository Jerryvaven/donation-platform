export interface Product {
    id: string;
    name: string;
    category: string;
    value: number;
    description?: string;
    image_url?: string;
}
export interface EcommerceProduct {
    id: string;
    name: string;
    category: 'Sauna' | 'Cold Plunge';
    price: number;
    description?: string;
    product_description?: string;
    health_benefits_description?: string;
    card_features?: string[];
    features?: string[];
    benefits?: string[];
    specifications?: string[];
    specifications_data?: Record<string, any>;
    feature_slides?: Array<{
        title: string;
        description: string;
        image: string;
        icon?: string;
    }>;
    questions_answers?: Array<{
        question: string;
        answer: string;
    }>;
    image_url?: string;
    gallery_images?: string[];
    specifications_image?: string;
    stock_quantity?: number;
    is_available?: boolean;
    sku?: string;
    weight?: number;
    dimensions?: string;
    warranty_info?: string;
    shipping_info?: string;
    created_at?: string;
    updated_at?: string;
}
export interface FireDepartment {
    id: string;
    name: string;
    city?: string;
    county?: string;
    address?: string;
    latitude?: string;
    longitude?: string;
}
export interface ProductDonation {
    id: string;
    donor_id: string;
    product_id: string;
    fire_department_id?: string;
    quantity: number;
    donation_date: string;
    matched: boolean;
    status: string;
    notes?: string;
    created_at: string;
    products?: Product;
    fire_departments?: FireDepartment;
}
export interface Donor {
    id: string;
    name: string;
    total_donated_value: number;
    total_products_donated: number;
    city?: string;
    state?: string;
    address?: string;
    latitude?: string;
    longitude?: string;
    created_at: string;
    updated_at?: string;
    product_donations?: ProductDonation[];
}
export interface DashboardStats {
    totalDonatedValue: number;
    totalProductsDonated: number;
    totalDonors: number;
    matchedProducts: number;
    saunaDonated: number;
    coldPlungeDonated: number;
    fireDepartmentsReached: number;
    todaysProducts: number;
    newDonorsToday: number;
    matchRate: number;
    totalDonatedValueGrowth: number;
    totalProductsDonatedGrowth: number;
    totalDonorsGrowth: number;
    matchedProductsGrowth: number;
    fireDepartmentsReachedGrowth: number;
}
export interface RecentProductDonation {
    id: string;
    donorId: string;
    donorName: string;
    productId: string;
    productName: string;
    productValue: number;
    productImage?: string;
    fireDepartmentId: string | null;
    fireDepartmentName: string;
    quantity: number;
    city: string;
    state: string;
    address?: string;
    date: string;
    status: 'MATCHED' | 'PENDING';
}
export interface ActivityItem {
    id: string;
    type: 'donation' | 'match' | 'update' | 'goal';
    message: string;
    timestamp: string;
    icon: string;
    color: string;
}
export interface MonthlyData {
    month: string;
    donations: number;
    matched: number;
}
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}
export interface CartItem {
    id: string;
    name: string;
    price: string;
    quantity: number;
    image: string;
    category: 'Sauna' | 'Cold Plunge';
    sku?: string;
    type?: string;
}
export interface CheckoutFormData {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingZipCode: string;
    shippingCountry: string;
    billingAddress?: string;
    billingCity?: string;
    billingState?: string;
    billingZipCode?: string;
    billingCountry?: string;
    sameAsShipping: boolean;
    customerNotes?: string;
    couponCode?: string;
}
export interface OrderItem {
    id: string;
    orderId: string;
    ecommerceProductId?: string;
    productName: string;
    productSku?: string;
    pricePerUnit: number;
    quantity: number;
    lineTotal: number;
    productImageUrl?: string;
    productCategory: 'Sauna' | 'Cold Plunge';
    createdAt: string;
    updatedAt: string;
}
export interface Order {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingZipCode: string;
    shippingCountry: string;
    billingAddress?: string;
    billingCity?: string;
    billingState?: string;
    billingZipCode?: string;
    billingCountry?: string;
    sameAsShipping: boolean;
    subtotal: number;
    shippingCost: number;
    tax: number;
    discountAmount: number;
    total: number;
    couponCode?: string;
    couponDiscountType?: 'percentage' | 'fixed';
    couponDiscountValue?: number;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    paymentMethod?: string;
    trackingNumber?: string;
    shippingProvider?: string;
    shippedDate?: string;
    deliveredDate?: string;
    customerNotes?: string;
    internalNotes?: string;
    userId?: string;
    userAgent?: string;
    ipAddress?: string;
    createdAt: string;
    updatedAt: string;
    items?: OrderItem[];
    payments?: OrderPayment[];
}
export interface OrderPayment {
    id: string;
    orderId: string;
    paymentMethod: string;
    amount: number;
    currency: string;
    transactionId?: string;
    status: 'pending' | 'succeeded' | 'failed' | 'refunded';
    paymentResponse?: Record<string, any>;
    refundId?: string;
    refundAmount?: number;
    refundReason?: string;
    refundStatus?: 'pending' | 'succeeded' | 'failed';
    createdAt: string;
    updatedAt: string;
}
export interface Coupon {
    id: string;
    code: string;
    description?: string;
    discountType: 'percentage' | 'fixed_amount';
    discountValue: number;
    minimumPurchase?: number;
    maximumUses?: number;
    maximumUsesPerCustomer?: number;
    validFrom?: string;
    validUntil?: string;
    usedCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface CouponUsage {
    id: string;
    couponId: string;
    orderId: string;
    email: string;
    createdAt: string;
}
