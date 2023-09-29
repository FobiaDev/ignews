import { useRouter } from "next/router";

import { useSession, signIn } from "next-auth/react";

import { api } from "../../services/axios";
import { getStripeJs } from "../../services/stripe-js";

import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

const SubscribeButton = ({ priceId }: SubscribeButtonProps): JSX.Element => {
  const { data: session } = useSession();
  const { push } = useRouter();

  const handleSubscribe = async () => {
    if (!session) {
      signIn("github");
      return;
    }

    if (session?.activeSubscription) {
      push("/posts");
      return;
    }

    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={() => handleSubscribe()}
    >
      Subscribe now
    </button>
  );
};

export default SubscribeButton;
