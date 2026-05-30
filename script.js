// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const goTopBtn = document.getElementById('goTopBtn');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for subscribing to our newsletter!');
        newsletterForm.reset();
    });
}

// Property navigation
const propertyCards = document.querySelectorAll('.property-card');

const locationInput = document.getElementById('searchLocationInput');
const typeSelect = document.getElementById('searchTypeSelect');
const priceSelect = document.getElementById('searchPriceSelect');
const searchBtn = document.getElementById('searchPropertiesBtn');
const searchResultMessage = document.getElementById('searchResultMessage');

const parsePriceToNumber = (priceText = '') => {
    const digits = priceText.replace(/[^\d]/g, '');
    return digits ? Number.parseInt(digits, 10) : 0;
};

const matchesPriceRange = (priceValue, selectedRange) => {
    if (!selectedRange || selectedRange === 'Price Range') return true;
    if (selectedRange === 'Under ₨50L') return priceValue <= 5000000;
    if (selectedRange === '₨50L - ₨1Cr') return priceValue > 5000000 && priceValue <= 10000000;
    if (selectedRange === 'Above ₨1Cr') return priceValue > 10000000;
    return true;
};

const filterProperties = () => {
    if (!propertyCards.length) return;

    const locationQuery = (locationInput?.value || '').trim().toLowerCase();
    const selectedType = (typeSelect?.value || '').trim().toLowerCase();
    const selectedPrice = (priceSelect?.value || '').trim();

    let visibleCount = 0;

    propertyCards.forEach((card) => {
        const locationText = (card.dataset.location || '').toLowerCase();
        const typeText = (card.dataset.type || '').toLowerCase();
        const priceValue = parsePriceToNumber(card.dataset.price || '');

        const locationMatch = !locationQuery || locationText.includes(locationQuery);
        const typeMatch = !selectedType || selectedType === 'property type' || typeText.includes(selectedType);
        const priceMatch = matchesPriceRange(priceValue, selectedPrice);
        const shouldShow = locationMatch && typeMatch && priceMatch;

        card.classList.toggle('is-hidden-search', !shouldShow);
        if (shouldShow) visibleCount += 1;
    });

    if (searchResultMessage) {
        searchResultMessage.textContent = `Showing ${visibleCount} of ${propertyCards.length} properties`;
    }
};

if (searchBtn) {
    searchBtn.addEventListener('click', filterProperties);
}

if (locationInput) {
    locationInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            filterProperties();
        }
    });
}

if (typeSelect) {
    typeSelect.addEventListener('change', filterProperties);
}

if (priceSelect) {
    priceSelect.addEventListener('change', filterProperties);
}

if (searchResultMessage && propertyCards.length) {
    searchResultMessage.textContent = `Showing ${propertyCards.length} of ${propertyCards.length} properties`;
}

const getPropertyData = (card) => ({
    title: card.dataset.title,
    price: card.dataset.price,
    location: card.dataset.location,
    status: card.dataset.status,
    description: card.dataset.description,
    type: card.dataset.type,
    availability: card.dataset.availability,
    parking: card.dataset.parking,
    year: card.dataset.year,
    image: card.dataset.image,
    ownerName: card.dataset.ownerName,
    ownerPhone: card.dataset.ownerPhone,
    beds: card.dataset.beds,
    baths: card.dataset.baths,
    area: card.dataset.area,
    highlights: (card.dataset.highlights || '').split('|').filter(Boolean)
});

const openPropertyPage = (card, options = {}) => {
    if (!card) return;

    const { focusForm = false } = options;
    const property = getPropertyData(card);
    const params = new URLSearchParams({
        title: property.title,
        price: property.price,
        location: property.location,
        status: property.status,
        description: property.description,
        type: property.type,
        availability: property.availability,
        parking: property.parking,
        year: property.year,
        image: property.image,
        ownerName: property.ownerName,
        ownerPhone: property.ownerPhone,
        beds: property.beds,
        baths: property.baths,
        area: property.area,
        highlights: property.highlights.join('|'),
        action: focusForm ? 'order' : 'details'
    });

    window.location.href = `property-details.html?${params.toString()}`;
};

propertyCards.forEach((card) => {
    card.addEventListener('click', (event) => {
        const orderButton = event.target.closest('.order-btn');

        if (orderButton) {
            openPropertyPage(card, { focusForm: true });
            return;
        }

        if (!event.target.closest('.property-action') || event.target.closest('.details-btn')) {
            openPropertyPage(card);
        }
    });
});

const initPropertyDetailsPage = () => {
    const detailsRoot = document.getElementById('propertyDetailsPage');
    if (!detailsRoot) return;

    const params = new URLSearchParams(window.location.search);
    const fallbackProperty = {
        title: 'Property Details',
        price: 'Price on request',
        location: 'Nepal',
        status: 'Available',
        description: 'Detailed property information will appear here when you open a property from the homepage.',
        type: 'Residential',
        availability: 'Contact for latest availability',
        parking: 'Contact for parking details',
        year: 'Contact for build details',
        image: 'images/properties1.avif',
        ownerName: 'Property Owner',
        ownerPhone: '+977-9800000000',
        beds: 'N/A',
        baths: 'N/A',
        area: 'N/A',
        highlights: ['Contact us for full highlights']
    };

    const getParam = (name, fallback) => params.get(name) || fallback;
    const property = {
        title: getParam('title', fallbackProperty.title),
        price: getParam('price', fallbackProperty.price),
        location: getParam('location', fallbackProperty.location),
        status: getParam('status', fallbackProperty.status),
        description: getParam('description', fallbackProperty.description),
        type: getParam('type', fallbackProperty.type),
        availability: getParam('availability', fallbackProperty.availability),
        parking: getParam('parking', fallbackProperty.parking),
        year: getParam('year', fallbackProperty.year),
        image: getParam('image', fallbackProperty.image),
        ownerName: getParam('ownerName', fallbackProperty.ownerName),
        ownerPhone: getParam('ownerPhone', fallbackProperty.ownerPhone),
        beds: getParam('beds', fallbackProperty.beds),
        baths: getParam('baths', fallbackProperty.baths),
        area: getParam('area', fallbackProperty.area),
        highlights: (params.get('highlights') || '').split('|').filter(Boolean)
    };

    if (property.highlights.length === 0) {
        property.highlights = fallbackProperty.highlights;
    }

    const detailsMap = {
        showcaseImage: { key: 'image', type: 'src' },
        showcaseTitle: { key: 'title', type: 'text' },
        showcasePrice: { key: 'price', type: 'text' },
        showcaseStatus: { key: 'status', type: 'text' },
        showcaseDescription: { key: 'description', type: 'text' },
        showcaseType: { key: 'type', type: 'text' },
        showcaseAvailability: { key: 'availability', type: 'text' },
        showcaseParking: { key: 'parking', type: 'text' },
        showcaseYear: { key: 'year', type: 'text' },
        pagePropertyTitle: { key: 'title', type: 'text' },
        selectedPropertyInput: { key: 'title', type: 'value' }
    };

    Object.keys(detailsMap).forEach((id) => {
        const config = detailsMap[id];
        const element = document.getElementById(id);
        if (!element) return;

        if (config.type === 'src') {
            element.src = property[config.key];
            element.alt = property.title;
            return;
        }

        if (config.type === 'value') {
            element.value = property[config.key];
            return;
        }

        element.textContent = property[config.key];
    });

    const showcaseLocation = document.getElementById('showcaseLocation');
    if (showcaseLocation) {
        showcaseLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${property.location}`;
    }

    const showcaseFeatures = document.getElementById('showcaseFeatures');
    if (showcaseFeatures) {
        showcaseFeatures.innerHTML = `
            <span><i class="fas fa-bed"></i> ${property.beds}</span>
            <span><i class="fas fa-bath"></i> ${property.baths}</span>
            <span><i class="fas fa-ruler-combined"></i> ${property.area}</span>
        `;
    }

    const ownerPhoneLink = document.getElementById('ownerPhoneLink');
    if (ownerPhoneLink) {
        ownerPhoneLink.textContent = property.ownerPhone;
        ownerPhoneLink.href = `tel:${property.ownerPhone.replace(/\s+/g, '')}`;
    }

    const ownerNameText = document.getElementById('ownerNameText');
    if (ownerNameText) {
        ownerNameText.textContent = property.ownerName;
    }

    const showcaseHighlights = document.getElementById('showcaseHighlights');
    if (showcaseHighlights) {
        showcaseHighlights.innerHTML = property.highlights
            .map((highlight) => `<li>${highlight}</li>`)
            .join('');
    }

    const propertyOrderForm = document.getElementById('propertyOrderForm');
    if (propertyOrderForm) {
        propertyOrderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert(`Thank you. Your request for ${property.title} has been received. Our team will contact you shortly.`);
            propertyOrderForm.reset();
            const selectedPropertyInput = document.getElementById('selectedPropertyInput');
            if (selectedPropertyInput) {
                selectedPropertyInput.value = property.title;
            }
        });

        if (params.get('action') === 'order') {
            const firstInput = propertyOrderForm.querySelector('input:not([type="hidden"])');
            if (firstInput) {
                firstInput.focus({ preventScroll: true });
            }
        }
    }
};

initPropertyDetailsPage();

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    }

    if (goTopBtn) {
        goTopBtn.classList.toggle('show', window.scrollY > 300);
    }
});

if (goTopBtn) {
    goTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Animate property cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all property cards
document.querySelectorAll('.property-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});