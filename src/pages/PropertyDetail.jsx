import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Building2, Phone, Mail, Share2, Loader2,
  Bed, Bath, Maximize, Star, Calendar, CheckCircle2, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAdminData } from '@/lib/AdminDataContext';

function formatPrice(price) {
  if (price >= 10000000) return `NPR ${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `NPR ${(price / 100000).toFixed(1)} L`;
  return `NPR ${price?.toLocaleString()}`;
}

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeImage, setActiveImage] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);

  const { properties, addInquiry } = useAdminData();
  const property = properties.find(p => p.id === id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSending(true);
    setTimeout(() => {
      addInquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        property_id: id,
        property_title: property?.title,
      });
      toast({ title: 'Inquiry sent!', description: 'We will get back to you shortly.' });
      setForm({ name: '', email: '', phone: '', message: '' });
      setSending(false);
    }, 400);
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button variant="ghost" size="sm" onClick={() => navigate('/properties')} className="flex items-center gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Button>
          <Alert variant="destructive">
            <AlertDescription>Property not found.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const images = property.images?.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80'];

  const features = property.features?.length > 0 ? property.features : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky top bar */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/properties')} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              toast({ title: 'Link copied!' });
            }}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                <img
                  src={images[activeImage]}
                  alt={`${property.title} - image ${activeImage + 1}`}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((p) => (p - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImage((p) => (p + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={`w-2 h-2 rounded-full transition ${i === activeImage ? 'bg-white' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition ${i === activeImage ? 'border-primary' : 'border-transparent'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Badges */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-primary text-primary-foreground">
                  {property.status === 'sale' ? 'For Sale' : 'For Rent'}
                </Badge>
                {property.featured && (
                  <Badge className="bg-accent text-accent-foreground">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
                <Badge variant="outline" className="capitalize">{property.type}</Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{property.title}</h1>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5 shrink-0" />
                <span>{property.address || `${property.city}, ${property.district}`}</span>
              </div>

              <p className="text-3xl font-bold text-primary">
                {formatPrice(property.price)}
                {property.status === 'rent' && <span className="text-lg font-normal text-muted-foreground">/mo</span>}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {property.bedrooms > 0 && (
                <div className="p-4 bg-muted rounded-xl text-center space-y-1">
                  <Bed className="w-6 h-6 mx-auto text-primary" />
                  <p className="text-2xl font-bold text-foreground">{property.bedrooms}</p>
                  <p className="text-xs text-muted-foreground">Bedrooms</p>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="p-4 bg-muted rounded-xl text-center space-y-1">
                  <Bath className="w-6 h-6 mx-auto text-primary" />
                  <p className="text-2xl font-bold text-foreground">{property.bathrooms}</p>
                  <p className="text-xs text-muted-foreground">Bathrooms</p>
                </div>
              )}
              {property.area > 0 && (
                <div className="p-4 bg-muted rounded-xl text-center space-y-1">
                  <Maximize className="w-6 h-6 mx-auto text-primary" />
                  <p className="text-2xl font-bold text-foreground">{property.area}</p>
                  <p className="text-xs text-muted-foreground">{property.area_unit || 'sqft'}</p>
                </div>
              )}
              {property.listed_date && (
                <div className="p-4 bg-muted rounded-xl text-center space-y-1">
                  <Calendar className="w-6 h-6 mx-auto text-primary" />
                  <p className="text-sm font-bold text-foreground">
                    {new Date(property.listed_date).toLocaleDateString('en-NP', { month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-muted-foreground">Listed</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">About this property</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {property.description || 'No description available for this property.'}
              </p>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-foreground">Features & Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-card border border-border rounded-xl p-6 space-y-5 sticky top-20">
              <h3 className="text-xl font-bold text-foreground">Interested in this property?</h3>

              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  placeholder="Your Name *"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
                <Input
                  type="email"
                  placeholder="Your Email *"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
                <Input
                  type="tel"
                  placeholder="Your Phone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
                <Textarea
                  placeholder={`I'm interested in ${property.title}...`}
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                />
                <Button type="submit" className="w-full" size="lg" disabled={sending}>
                  {sending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                  ) : 'Send Inquiry'}
                </Button>
              </form>

              <div className="border-t border-border pt-5 space-y-3">
                <h4 className="font-semibold text-foreground">
                  {property.seller?.name ? `Listed by ${property.seller.name}` : 'Contact Agent'}
                </h4>
                {property.seller?.agency && (
                  <p className="text-xs text-muted-foreground">{property.seller.agency}</p>
                )}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">
                      {property.seller?.phone || property.contact_phone || '+977-1-4234567'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">
                      {property.seller?.email || 'agent@nepalestates.com'}
                    </span>
                  </div>
                  {property.city && (
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">{property.city}, Nepal</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
