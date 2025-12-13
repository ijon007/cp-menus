import { Metadata } from 'next'
import { formatSlugToTitle } from '@/lib/utils'

type Props = {
  params: Promise<{ 'restaurant-slug': string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: { params: Promise<{ 'restaurant-slug': string }> }): Promise<Metadata> {
  const { 'restaurant-slug': restaurantSlug } = await params
  const restaurantName = formatSlugToTitle(restaurantSlug)
  
  return {
    title: `${restaurantName} Menu`,
    description: `Digital Menu for ${restaurantName}`,
  }
}

export default function RestaurantLayout({ children }: Props) {
  return (
    <div>
      {children}
    </div>
  );
};