import stripe from "stripe";
import settings from "../settings";
import eventModel from "../mongo/stripe/eventModel";

export default (async (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, settings.stripeSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    if (event) {
        try {
            const stripe = new (eventModel())({event: JSON.stringify((event))})
            await stripe.save()
        } catch (e) {
            console.log(e)
        }
    }
    switch (event.type) {
        case 'account.updated':
            const accountUpdated = event.data.object;
            console.log(accountUpdated)
            break;
        case 'account.external_account.created':
            const accountExternalAccountCreated = event.data.object;
            console.log(accountExternalAccountCreated)
            break;
        case 'account.external_account.deleted':
            const accountExternalAccountDeleted = event.data.object;
            console.log(accountExternalAccountDeleted)
            break;
        case 'account.external_account.updated':
            const accountExternalAccountUpdated = event.data.object;
            console.log(accountExternalAccountUpdated)
            break;
        case 'balance.available':
            const balanceAvailable = event.data.object;
            console.log(balanceAvailable)
            break;
        case 'billing_portal.configuration.created':
            const billingPortalConfigurationCreated = event.data.object;
            console.log(billingPortalConfigurationCreated)
            break;
        case 'billing_portal.configuration.updated':
            const billingPortalConfigurationUpdated = event.data.object;
            console.log(billingPortalConfigurationUpdated)
            break;
        case 'billing_portal.session.created':
            const billingPortalSessionCreated = event.data.object;
            console.log(billingPortalSessionCreated)
            break;
        case 'capability.updated':
            const capabilityUpdated = event.data.object;
            console.log(capabilityUpdated)
            break;
        case 'cash_balance.funds_available':
            const cashBalanceFundsAvailable = event.data.object;
            console.log(cashBalanceFundsAvailable)
            break;
        case 'charge.captured':
            const chargeCaptured = event.data.object;
            console.log(chargeCaptured)
            break;
        case 'charge.expired':
            const chargeExpired = event.data.object;
            console.log(chargeExpired)
            break;
        case 'charge.failed':
            const chargeFailed = event.data.object;
            console.log(chargeFailed)
            break;
        case 'charge.pending':
            const chargePending = event.data.object;
            console.log(chargePending)
            break;
        case 'charge.refunded':
            const chargeRefunded = event.data.object;
            console.log(chargeRefunded)
            break;
        case 'charge.succeeded':
            const chargeSucceeded = event.data.object;
            console.log(chargeSucceeded)
            break;
        case 'charge.updated':
            const chargeUpdated = event.data.object;
            console.log(chargeUpdated)
            break;
        case 'charge.dispute.closed':
            const chargeDisputeClosed = event.data.object;
            console.log(chargeDisputeClosed)
            break;
        case 'charge.dispute.created':
            const chargeDisputeCreated = event.data.object;
            console.log(chargeDisputeCreated)
            break;
        case 'charge.dispute.funds_reinstated':
            const chargeDisputeFundsReinstated = event.data.object;
            console.log(chargeDisputeFundsReinstated)
            break;
        case 'charge.dispute.funds_withdrawn':
            const chargeDisputeFundsWithdrawn = event.data.object;
            console.log(chargeDisputeFundsWithdrawn)
            break;
        case 'charge.dispute.updated':
            const chargeDisputeUpdated = event.data.object;
            console.log(chargeDisputeUpdated)
            break;
        case 'charge.refund.updated':
            const chargeRefundUpdated = event.data.object;
            console.log(chargeRefundUpdated)
            break;
        case 'checkout.session.async_payment_failed':
            const checkoutSessionAsyncPaymentFailed = event.data.object;
            console.log(checkoutSessionAsyncPaymentFailed)
            break;
        case 'checkout.session.async_payment_succeeded':
            const checkoutSessionAsyncPaymentSucceeded = event.data.object;
            console.log(checkoutSessionAsyncPaymentSucceeded)
            break;
        case 'checkout.session.completed':
            const checkoutSessionCompleted = event.data.object;
            console.log(checkoutSessionCompleted)
            break;
        case 'checkout.session.expired':
            const checkoutSessionExpired = event.data.object;
            console.log(checkoutSessionExpired)
            break;
        case 'climate.order.canceled':
            const climateOrderCanceled = event.data.object;
            console.log(climateOrderCanceled)
            break;
        case 'climate.order.created':
            const climateOrderCreated = event.data.object;
            console.log(climateOrderCreated)
            break;
        case 'climate.order.delayed':
            const climateOrderDelayed = event.data.object;
            console.log(climateOrderDelayed)
            break;
        case 'climate.order.delivered':
            const climateOrderDelivered = event.data.object;
            console.log(climateOrderDelivered)
            break;
        case 'climate.order.product_substituted':
            const climateOrderProductSubstituted = event.data.object;
            console.log(climateOrderProductSubstituted)
            break;
        case 'climate.product.created':
            const climateProductCreated = event.data.object;
            console.log(climateProductCreated)
            break;
        case 'climate.product.pricing_updated':
            const climateProductPricingUpdated = event.data.object;
            console.log(climateProductPricingUpdated)
            break;
        case 'coupon.created':
            const couponCreated = event.data.object;
            console.log(couponCreated)
            break;
        case 'coupon.deleted':
            const couponDeleted = event.data.object;
            console.log(couponDeleted)
            break;
        case 'coupon.updated':
            const couponUpdated = event.data.object;
            console.log(couponUpdated)
            break;
        case 'credit_note.created':
            const creditNoteCreated = event.data.object;
            console.log(creditNoteCreated)
            break;
        case 'credit_note.updated':
            const creditNoteUpdated = event.data.object;
            console.log(creditNoteUpdated)
            break;
        case 'credit_note.voided':
            const creditNoteVoided = event.data.object;
            console.log(creditNoteVoided)
            break;
        case 'customer.created':
            const customerCreated = event.data.object;
            console.log(customerCreated)
            break;
        case 'customer.deleted':
            const customerDeleted = event.data.object;
            console.log(customerDeleted)
            break;
        case 'customer.updated':
            const customerUpdated = event.data.object;
            console.log(customerUpdated)
            break;
        case 'customer.discount.created':
            const customerDiscountCreated = event.data.object;
            console.log(customerDiscountCreated)
            break;
        case 'customer.discount.deleted':
            const customerDiscountDeleted = event.data.object;
            console.log(customerDiscountDeleted)
            break;
        case 'customer.discount.updated':
            const customerDiscountUpdated = event.data.object;
            console.log(customerDiscountUpdated)
            break;
        case 'customer.source.created':
            const customerSourceCreated = event.data.object;
            console.log(customerSourceCreated)
            break;
        case 'customer.source.deleted':
            const customerSourceDeleted = event.data.object;
            console.log(customerSourceDeleted)
            break;
        case 'customer.source.expiring':
            const customerSourceExpiring = event.data.object;
            console.log(customerSourceExpiring)
            break;
        case 'customer.source.updated':
            const customerSourceUpdated = event.data.object;
            console.log(customerSourceUpdated)
            break;
        case 'customer.subscription.created':
            const customerSubscriptionCreated = event.data.object;
            console.log(customerSubscriptionCreated)
            break;
        case 'customer.subscription.deleted':
            const customerSubscriptionDeleted = event.data.object;
            console.log(customerSubscriptionDeleted)
            break;
        case 'customer.subscription.paused':
            const customerSubscriptionPaused = event.data.object;
            console.log(customerSubscriptionPaused)
            break;
        case 'customer.subscription.pending_update_applied':
            const customerSubscriptionPendingUpdateApplied = event.data.object;
            console.log(customerSubscriptionPendingUpdateApplied)
            break;
        case 'customer.subscription.pending_update_expired':
            const customerSubscriptionPendingUpdateExpired = event.data.object;
            console.log(customerSubscriptionPendingUpdateExpired)
            break;
        case 'customer.subscription.resumed':
            const customerSubscriptionResumed = event.data.object;
            console.log(customerSubscriptionResumed)
            break;
        case 'customer.subscription.trial_will_end':
            const customerSubscriptionTrialWillEnd = event.data.object;
            console.log(customerSubscriptionTrialWillEnd)
            break;
        case 'customer.subscription.updated':
            const customerSubscriptionUpdated = event.data.object;
            console.log(customerSubscriptionUpdated)
            break;
        case 'customer.tax_id.created':
            const customerTaxIdCreated = event.data.object;
            console.log(customerTaxIdCreated)
            break;
        case 'customer.tax_id.deleted':
            const customerTaxIdDeleted = event.data.object;
            console.log(customerTaxIdDeleted)
            break;
        case 'customer.tax_id.updated':
            const customerTaxIdUpdated = event.data.object;
            console.log(customerTaxIdUpdated)
            break;
        case 'customer_cash_balance_transaction.created':
            const customerCashBalanceTransactionCreated = event.data.object;
            console.log(customerCashBalanceTransactionCreated)
            break;
        case 'file.created':
            const fileCreated = event.data.object;
            console.log(fileCreated)
            break;
        case 'financial_connections.account.created':
            const financialConnectionsAccountCreated = event.data.object;
            console.log(financialConnectionsAccountCreated)
            break;
        case 'financial_connections.account.deactivated':
            const financialConnectionsAccountDeactivated = event.data.object;
            console.log(financialConnectionsAccountDeactivated)
            break;
        case 'financial_connections.account.disconnected':
            const financialConnectionsAccountDisconnected = event.data.object;
            console.log(financialConnectionsAccountDisconnected)
            break;
        case 'financial_connections.account.reactivated':
            const financialConnectionsAccountReactivated = event.data.object;
            console.log(financialConnectionsAccountReactivated)
            break;
        case 'financial_connections.account.refreshed_balance':
            const financialConnectionsAccountRefreshedBalance = event.data.object;
            console.log(financialConnectionsAccountRefreshedBalance)
            break;
        case 'identity.verification_session.canceled':
            const identityVerificationSessionCanceled = event.data.object;
            console.log(identityVerificationSessionCanceled)
            break;
        case 'identity.verification_session.created':
            const identityVerificationSessionCreated = event.data.object;
            console.log(identityVerificationSessionCreated)
            break;
        case 'identity.verification_session.processing':
            const identityVerificationSessionProcessing = event.data.object;
            console.log(identityVerificationSessionProcessing)
            break;
        case 'identity.verification_session.requires_input':
            const identityVerificationSessionRequiresInput = event.data.object;
            console.log(identityVerificationSessionRequiresInput)
            break;
        case 'identity.verification_session.verified':
            const identityVerificationSessionVerified = event.data.object;
            console.log(identityVerificationSessionVerified)
            break;
        case 'invoice.created':
            const invoiceCreated = event.data.object;
            console.log(invoiceCreated)
            break;
        case 'invoice.deleted':
            const invoiceDeleted = event.data.object;
            console.log(invoiceDeleted)
            break;
        case 'invoice.finalization_failed':
            const invoiceFinalizationFailed = event.data.object;
            console.log(invoiceFinalizationFailed)
            break;
        case 'invoice.finalized':
            const invoiceFinalized = event.data.object;
            console.log(invoiceFinalized)
            break;
        case 'invoice.marked_uncollectible':
            const invoiceMarkedUncollectible = event.data.object;
            console.log(invoiceMarkedUncollectible)
            break;
        case 'invoice.paid':
            const invoicePaid = event.data.object;
            console.log(invoicePaid)
            break;
        case 'invoice.payment_action_required':
            const invoicePaymentActionRequired = event.data.object;
            console.log(invoicePaymentActionRequired)
            break;
        case 'invoice.payment_failed':
            const invoicePaymentFailed = event.data.object;
            console.log(invoicePaymentFailed)
            break;
        case 'invoice.payment_succeeded':
            const invoicePaymentSucceeded = event.data.object;
            console.log(invoicePaymentSucceeded)
            break;
        case 'invoice.sent':
            const invoiceSent = event.data.object;
            console.log(invoiceSent)
            break;
        case 'invoice.upcoming':
            const invoiceUpcoming = event.data.object;
            console.log(invoiceUpcoming)
            break;
        case 'invoice.updated':
            const invoiceUpdated = event.data.object;
            console.log(invoiceUpdated)
            break;
        case 'invoice.voided':
            const invoiceVoided = event.data.object;
            console.log(invoiceVoided)
            break;
        case 'invoiceitem.created':
            const invoiceitemCreated = event.data.object;
            console.log(invoiceitemCreated)
            break;
        case 'invoiceitem.deleted':
            const invoiceitemDeleted = event.data.object;
            console.log(invoiceitemDeleted)
            break;
        case 'issuing_authorization.created':
            const issuingAuthorizationCreated = event.data.object;
            console.log(issuingAuthorizationCreated)
            break;
        case 'issuing_authorization.updated':
            const issuingAuthorizationUpdated = event.data.object;
            console.log(issuingAuthorizationUpdated)
            break;
        case 'issuing_card.created':
            const issuingCardCreated = event.data.object;
            console.log(issuingCardCreated)
            break;
        case 'issuing_card.updated':
            const issuingCardUpdated = event.data.object;
            console.log(issuingCardUpdated)
            break;
        case 'issuing_cardholder.created':
            const issuingCardholderCreated = event.data.object;
            console.log(issuingCardholderCreated)
            break;
        case 'issuing_cardholder.updated':
            const issuingCardholderUpdated = event.data.object;
            console.log(issuingCardholderUpdated)
            break;
        case 'issuing_dispute.closed':
            const issuingDisputeClosed = event.data.object;
            console.log(issuingDisputeClosed)
            break;
        case 'issuing_dispute.created':
            const issuingDisputeCreated = event.data.object;
            console.log(issuingDisputeCreated)
            break;
        case 'issuing_dispute.funds_reinstated':
            const issuingDisputeFundsReinstated = event.data.object;
            console.log(issuingDisputeFundsReinstated)
            break;
        case 'issuing_dispute.submitted':
            const issuingDisputeSubmitted = event.data.object;
            console.log(issuingDisputeSubmitted)
            break;
        case 'issuing_dispute.updated':
            const issuingDisputeUpdated = event.data.object;
            console.log(issuingDisputeUpdated)
            break;
        case 'issuing_token.created':
            const issuingTokenCreated = event.data.object;
            console.log(issuingTokenCreated)
            break;
        case 'issuing_token.updated':
            const issuingTokenUpdated = event.data.object;
            console.log(issuingTokenUpdated)
            break;
        case 'issuing_transaction.created':
            const issuingTransactionCreated = event.data.object;
            console.log(issuingTransactionCreated)
            break;
        case 'issuing_transaction.updated':
            const issuingTransactionUpdated = event.data.object;
            console.log(issuingTransactionUpdated)
            break;
        case 'mandate.updated':
            const mandateUpdated = event.data.object;
            console.log(mandateUpdated)
            break;
        case 'payment_intent.amount_capturable_updated':
            const paymentIntentAmountCapturableUpdated = event.data.object;
            console.log(paymentIntentAmountCapturableUpdated)
            break;
        case 'payment_intent.canceled':
            const paymentIntentCanceled = event.data.object;
            console.log(paymentIntentCanceled)
            break;
        case 'payment_intent.created':
            const paymentIntentCreated = event.data.object;
            console.log(paymentIntentCreated)
            break;
        case 'payment_intent.partially_funded':
            const paymentIntentPartiallyFunded = event.data.object;
            console.log(paymentIntentPartiallyFunded)
            break;
        case 'payment_intent.payment_failed':
            const paymentIntentPaymentFailed = event.data.object;
            console.log(paymentIntentPaymentFailed)
            break;
        case 'payment_intent.processing':
            const paymentIntentProcessing = event.data.object;
            console.log(paymentIntentProcessing)
            break;
        case 'payment_intent.requires_action':
            const paymentIntentRequiresAction = event.data.object;
            console.log(paymentIntentRequiresAction)
            break;
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            console.log(paymentIntentSucceeded)
            break;
        case 'payment_link.created':
            const paymentLinkCreated = event.data.object;
            console.log(paymentLinkCreated)
            break;
        case 'payment_link.updated':
            const paymentLinkUpdated = event.data.object;
            console.log(paymentLinkUpdated)
            break;
        case 'payment_method.attached':
            const paymentMethodAttached = event.data.object;
            console.log(paymentMethodAttached)
            break;
        case 'payment_method.automatically_updated':
            const paymentMethodAutomaticallyUpdated = event.data.object;
            console.log(paymentMethodAutomaticallyUpdated)
            break;
        case 'payment_method.detached':
            const paymentMethodDetached = event.data.object;
            console.log(paymentMethodDetached)
            break;
        case 'payment_method.updated':
            const paymentMethodUpdated = event.data.object;
            console.log(paymentMethodUpdated)
            break;
        case 'payout.canceled':
            const payoutCanceled = event.data.object;
            console.log(payoutCanceled)
            break;
        case 'payout.created':
            const payoutCreated = event.data.object;
            console.log(payoutCreated)
            break;
        case 'payout.failed':
            const payoutFailed = event.data.object;
            console.log(payoutFailed)
            break;
        case 'payout.paid':
            const payoutPaid = event.data.object;
            console.log(payoutPaid)
            break;
        case 'payout.reconciliation_completed':
            const payoutReconciliationCompleted = event.data.object;
            console.log(payoutReconciliationCompleted)
            break;
        case 'payout.updated':
            const payoutUpdated = event.data.object;
            console.log(payoutUpdated)
            break;
        case 'person.created':
            const personCreated = event.data.object;
            console.log(personCreated)
            break;
        case 'person.deleted':
            const personDeleted = event.data.object;
            console.log(personDeleted)
            break;
        case 'person.updated':
            const personUpdated = event.data.object;
            console.log(personUpdated)
            break;
        case 'plan.created':
            const planCreated = event.data.object;
            console.log(planCreated)
            break;
        case 'plan.deleted':
            const planDeleted = event.data.object;
            console.log(planDeleted)
            break;
        case 'plan.updated':
            const planUpdated = event.data.object;
            console.log(planUpdated)
            break;
        case 'price.created':
            const priceCreated = event.data.object;
            console.log(priceCreated)
            break;
        case 'price.deleted':
            const priceDeleted = event.data.object;
            console.log(priceDeleted)
            break;
        case 'price.updated':
            const priceUpdated = event.data.object;
            console.log(priceUpdated)
            break;
        case 'product.created':
            const productCreated = event.data.object;
            console.log(productCreated)
            break;
        case 'product.deleted':
            const productDeleted = event.data.object;
            console.log(productDeleted)
            break;
        case 'product.updated':
            const productUpdated = event.data.object;
            console.log(productUpdated)
            break;
        case 'promotion_code.created':
            const promotionCodeCreated = event.data.object;
            console.log(promotionCodeCreated)
            break;
        case 'promotion_code.updated':
            const promotionCodeUpdated = event.data.object;
            console.log(promotionCodeUpdated)
            break;
        case 'quote.accepted':
            const quoteAccepted = event.data.object;
            console.log(quoteAccepted)
            break;
        case 'quote.canceled':
            const quoteCanceled = event.data.object;
            console.log(quoteCanceled)
            break;
        case 'quote.created':
            const quoteCreated = event.data.object;
            console.log(quoteCreated)
            break;
        case 'quote.finalized':
            const quoteFinalized = event.data.object;
            console.log(quoteFinalized)
            break;
        case 'radar.early_fraud_warning.created':
            const radarEarlyFraudWarningCreated = event.data.object;
            console.log(radarEarlyFraudWarningCreated)
            break;
        case 'radar.early_fraud_warning.updated':
            const radarEarlyFraudWarningUpdated = event.data.object;
            console.log(radarEarlyFraudWarningUpdated)
            break;
        case 'refund.created':
            const refundCreated = event.data.object;
            console.log(refundCreated)
            break;
        case 'refund.updated':
            const refundUpdated = event.data.object;
            console.log(refundUpdated)
            break;
        case 'reporting.report_run.failed':
            const reportingReportRunFailed = event.data.object;
            console.log(reportingReportRunFailed)
            break;
        case 'reporting.report_run.succeeded':
            const reportingReportRunSucceeded = event.data.object;
            console.log(reportingReportRunSucceeded)
            break;
        case 'review.closed':
            const reviewClosed = event.data.object;
            console.log(reviewClosed)
            break;
        case 'review.opened':
            const reviewOpened = event.data.object;
            console.log(reviewOpened)
            break;
        case 'setup_intent.canceled':
            const setupIntentCanceled = event.data.object;
            console.log(setupIntentCanceled)
            break;
        case 'setup_intent.created':
            const setupIntentCreated = event.data.object;
            console.log(setupIntentCreated)
            break;
        case 'setup_intent.requires_action':
            const setupIntentRequiresAction = event.data.object;
            console.log(setupIntentRequiresAction)
            break;
        case 'setup_intent.setup_failed':
            const setupIntentSetupFailed = event.data.object;
            console.log(setupIntentSetupFailed)
            break;
        case 'setup_intent.succeeded':
            const setupIntentSucceeded = event.data.object;
            console.log(setupIntentSucceeded)
            break;
        case 'sigma.scheduled_query_run.created':
            const sigmaScheduledQueryRunCreated = event.data.object;
            console.log(sigmaScheduledQueryRunCreated)
            break;
        case 'source.canceled':
            const sourceCanceled = event.data.object;
            console.log(sourceCanceled)
            break;
        case 'source.chargeable':
            const sourceChargeable = event.data.object;
            console.log(sourceChargeable)
            break;
        case 'source.failed':
            const sourceFailed = event.data.object;
            console.log(sourceFailed)
            break;
        case 'source.mandate_notification':
            const sourceMandateNotification = event.data.object;
            console.log(sourceMandateNotification)
            break;
        case 'source.refund_attributes_required':
            const sourceRefundAttributesRequired = event.data.object;
            console.log(sourceRefundAttributesRequired)
            break;
        case 'source.transaction.created':
            const sourceTransactionCreated = event.data.object;
            console.log(sourceTransactionCreated)
            break;
        case 'source.transaction.updated':
            const sourceTransactionUpdated = event.data.object;
            console.log(sourceTransactionUpdated)
            break;
        case 'subscription_schedule.aborted':
            const subscriptionScheduleAborted = event.data.object;
            console.log(subscriptionScheduleAborted)
            break;
        case 'subscription_schedule.canceled':
            const subscriptionScheduleCanceled = event.data.object;
            console.log(subscriptionScheduleCanceled)
            break;
        case 'subscription_schedule.completed':
            const subscriptionScheduleCompleted = event.data.object;
            console.log(subscriptionScheduleCompleted)
            break;
        case 'subscription_schedule.created':
            const subscriptionScheduleCreated = event.data.object;
            console.log(subscriptionScheduleCreated)
            break;
        case 'subscription_schedule.expiring':
            const subscriptionScheduleExpiring = event.data.object;
            console.log(subscriptionScheduleExpiring)
            break;
        case 'subscription_schedule.released':
            const subscriptionScheduleReleased = event.data.object;
            console.log(subscriptionScheduleReleased)
            break;
        case 'subscription_schedule.updated':
            const subscriptionScheduleUpdated = event.data.object;
            console.log(subscriptionScheduleUpdated)
            break;
        case 'tax.settings.updated':
            const taxSettingsUpdated = event.data.object;
            console.log(taxSettingsUpdated)
            break;
        case 'tax_rate.created':
            const taxRateCreated = event.data.object;
            console.log(taxRateCreated)
            break;
        case 'tax_rate.updated':
            const taxRateUpdated = event.data.object;
            console.log(taxRateUpdated)
            break;
        case 'terminal.reader.action_failed':
            const terminalReaderActionFailed = event.data.object;
            console.log(terminalReaderActionFailed)
            break;
        case 'terminal.reader.action_succeeded':
            const terminalReaderActionSucceeded = event.data.object;
            console.log(terminalReaderActionSucceeded)
            break;
        case 'test_helpers.test_clock.advancing':
            const testHelpersTestClockAdvancing = event.data.object;
            console.log(testHelpersTestClockAdvancing)
            break;
        case 'test_helpers.test_clock.created':
            const testHelpersTestClockCreated = event.data.object;
            console.log(testHelpersTestClockCreated)
            break;
        case 'test_helpers.test_clock.deleted':
            const testHelpersTestClockDeleted = event.data.object;
            console.log(testHelpersTestClockDeleted)
            break;
        case 'test_helpers.test_clock.internal_failure':
            const testHelpersTestClockInternalFailure = event.data.object;
            console.log(testHelpersTestClockInternalFailure)
            break;
        case 'test_helpers.test_clock.ready':
            const testHelpersTestClockReady = event.data.object;
            console.log(testHelpersTestClockReady)
            break;
        case 'topup.canceled':
            const topupCanceled = event.data.object;
            console.log(topupCanceled)
            break;
        case 'topup.created':
            const topupCreated = event.data.object;
            console.log(topupCreated)
            break;
        case 'topup.failed':
            const topupFailed = event.data.object;
            console.log(topupFailed)
            break;
        case 'topup.reversed':
            const topupReversed = event.data.object;
            console.log(topupReversed)
            break;
        case 'topup.succeeded':
            const topupSucceeded = event.data.object;
            console.log(topupSucceeded)
            break;
        case 'transfer.created':
            const transferCreated = event.data.object;
            console.log(transferCreated)
            break;
        case 'transfer.reversed':
            const transferReversed = event.data.object;
            console.log(transferReversed)
            break;
        case 'transfer.updated':
            const transferUpdated = event.data.object;
            console.log(transferUpdated)
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    response.send();
})