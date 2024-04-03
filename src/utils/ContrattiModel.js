// import mongoose from 'mongoose';

// const contractSchema = new mongoose.Schema({
//     generalita: {
//         ragioneSociale: String,
//         partitaIva: String,
//         codiceFiscaleAzienda: String,
//         indirizzo: String,
//         cap: String,
//         comune: String,
//         provincia: String,
//         codiceSdi: String,
//         pec: String,
//         telefono: String,
//         email: String,
//         titolare: String,
//         cellulare: String,
//         partitaIva: String,
//         codiceFiscaleTitolare: String,
//     },
//     selectedServices: [
//         {
//             serviceRef: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'Service'
//             },
//             selectedOptions: [
//                 {
//                     step: String,
//                     choice: String
//                 }
//             ]
//         }
//     ],
//     valore: {
//         valore: Number,
//         valoreRinnovo: Number,
//     },
//     durata: {
//         annuale: Boolean,
//         biennale: Boolean,
//         triennale: Boolean,
//     },
//     pagamento: {
//         valore: Number,
//         valoreRinnovo: Number,
//     }
// });


// export default mongoose.models.Contratto || mongoose.model('Contratto', contractSchema);



import mongoose from 'mongoose';

// Define a Service schema for the dynamic services listed in the contract
const ServiceSchema = new mongoose.Schema({
    serviceType: String,
    url: String, // Only for the website service type if necessary
    duration: String,
    price: Number,
});

// Define a PaymentDetails schema
const PaymentDetailsSchema = new mongoose.Schema({
    initialPayment: Number,
    balancePayment: Number,
    paymentMethod: String, // E.g., RID, Remissa Diretta
    iban: String,
    paymentTerms: String, // E.g., "% di € + IVA €", "n° rate da € cad. + IVA €"
});

// Define the main Contract schema
const ContractSchema = new mongoose.Schema({
    agencyCode: String,
    clientInformation: {
        companyName: String,
        vatId: String,
        taxCode: String,
        address: String,
        zipCode: String,
        city: String,
        province: String,
        sdiCode: String,
        pecEmail: String,
        phone: String,
        email: String,
        ownerName: String,
        ownerTaxCode: String,
        ownerCell: String,
    },
    services: [ServiceSchema],
    totalServiceAmount: Number,
    previousInterventions: String,
    preventiveCosts: String,
    serviceFee: Number,
    additionalCosts: {
        annual: Number,
        additionalAnnual: Number, // If applicable for the second year and onwards
    },
    contractDuration: String, // Could be "annual", "biennial", "one-time", etc.
    paymentDetails: PaymentDetailsSchema,
    dateAndPlace: String, // Assuming there is a date and place of contract signing
    additionalNotes: String, // Any additional notes that might be added to the contract
});

const Contract = mongoose.models.Contract || mongoose.model('Contract', ContractSchema);
export default Contract;
