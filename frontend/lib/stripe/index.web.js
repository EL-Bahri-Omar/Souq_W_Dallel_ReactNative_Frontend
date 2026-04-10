// Web-specific Stripe exports
// This file is automatically used by Metro when bundling for the web platform.
// It wraps @stripe/react-stripe-js and @stripe/stripe-js to match
// the same API as @stripe/stripe-react-native, so all components can use
// a single import path: '../lib/stripe'

import React, { useMemo } from 'react';
import { View } from 'react-native';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe as useStripeWeb,
  useElements,
} from '@stripe/react-stripe-js';

let stripePromise = null;

/**
 * StripeProvider wrapper for web.
 * Matches the native StripeProvider API: <StripeProvider publishableKey="pk_...">
 * Internally uses @stripe/react-stripe-js <Elements> provider.
 */
export function StripeProvider({ publishableKey, children }) {
  const stripe = useMemo(() => {
    if (!stripePromise) {
      stripePromise = loadStripe(publishableKey);
    }
    return stripePromise;
  }, [publishableKey]);

  return <Elements stripe={stripe}>{children}</Elements>;
}

/**
 * CardField wrapper for web.
 * Matches the native CardField API and renders a Stripe CardElement on web.
 * Props: postalCodeEnabled, placeholders, cardStyle, style, onCardChange
 */
export function CardField({
  postalCodeEnabled,
  placeholders,
  cardStyle,
  style,
  onCardChange,
}) {
  const handleChange = (event) => {
    if (onCardChange) {
      onCardChange({
        complete: event.complete,
        brand: event.brand || '',
        last4: event.value?.last4 || '',
        expiryMonth: event.value?.expiryMonth || null,
        expiryYear: event.value?.expiryYear || null,
        ...(event.error ? { error: event.error.message } : {}),
      });
    }
  };

  const elementStyle = {
    base: {
      fontSize: cardStyle?.fontSize ? `${cardStyle.fontSize}px` : '16px',
      color: cardStyle?.textColor || '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: cardStyle?.placeholderColor || '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  };

  return (
    <View
      style={[
        {
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#e0e0e0',
          borderRadius: cardStyle?.borderRadius || 8,
          padding: 12,
          backgroundColor: cardStyle?.backgroundColor || '#FFFFFF',
        },
        style,
      ]}
    >
      <CardElement
        options={{
          hidePostalCode: !postalCodeEnabled,
          style: elementStyle,
        }}
        onChange={handleChange}
      />
    </View>
  );
}

/**
 * useStripe wrapper for web.
 * Returns { confirmPayment } matching the native useStripe API.
 * Internally uses @stripe/react-stripe-js useStripe + useElements.
 */
export function useStripe() {
  const stripe = useStripeWeb();
  const elements = useElements();

  const confirmPayment = async (clientSecret, params) => {
    if (!stripe || !elements) {
      return {
        error: { message: 'Stripe has not been properly initialized' },
      };
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return { error: { message: 'Card information not found' } };
    }

    const billingDetails = params?.paymentMethodData?.billingDetails;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        ...(billingDetails
          ? {
              billing_details: {
                name: billingDetails.name,
                email: billingDetails.email,
              },
            }
          : {}),
      },
    });

    return {
      error: result.error || null,
      paymentIntent: result.paymentIntent || null,
    };
  };

  return { confirmPayment };
}
