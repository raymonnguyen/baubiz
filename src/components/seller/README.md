# Seller Components Guide

## VerifiedBadge Component

The `VerifiedBadge` component displays a verification status badge for sellers, indicating whether they are a verified "parent" or "business" seller.

### Usage

```tsx
import VerifiedBadge from '@/components/seller/VerifiedBadge';

// In your component
<VerifiedBadge 
  type="parent" // or "business"
  size="md" // "sm", "md", or "lg"
  showLabel={true} // boolean to show/hide text label
  className="mt-2" // additional classes
/>
```

### Props

- `type` (required): Can be either "parent" or "business"
  - "parent": Shows a blue badge indicating a verified parent seller
  - "business": Shows a purple badge indicating a verified business seller
  
- `size` (optional): Controls the size of the badge icon
  - "sm": Small size (16x16px)
  - "md": Medium size (20x20px) - default
  - "lg": Large size (24x24px)
  
- `showLabel` (optional): When true, shows a text label next to the icon
  - For "parent" type: Shows "Verified Parent"
  - For "business" type: Shows "Business Seller"

- `className` (optional): Any additional CSS classes to apply to the badge container

### How Verification Works

1. Parent Verification
   - Parents can verify their status through identity verification
   - Shows buyers that the seller is an actual parent selling used items

2. Business Verification
   - For business accounts selling new products or running a professional shop
   - Requires business license information and tax ID verification

### Implementation Examples

#### Using in a Seller Profile

```tsx
<div className="seller-profile">
  <h2>{seller.name}</h2>
  
  {seller.verificationType && (
    <VerifiedBadge 
      type={seller.verificationType} 
      showLabel={true}
      size="md"
    />
  )}
  
  <p className="seller-bio">{seller.bio}</p>
</div>
```

#### Using in a Product Listing

```tsx
<div className="product-listing">
  <div className="seller-info">
    <img src={seller.avatar} alt={seller.name} />
    <span>{seller.name}</span>
    
    {seller.verificationType && (
      <VerifiedBadge 
        type={seller.verificationType} 
        size="sm"
      />
    )}
  </div>
</div>
```

### Visual Appearance

Parent Badge: Blue background with check icon
Business Badge: Purple background with check icon

Both badges include tooltips that explain what the verification means when users hover over them. 