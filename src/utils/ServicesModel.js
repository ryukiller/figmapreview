const serviceSchema = new mongoose.Schema({
    name: String,
    steps: [
        {
            step: String,
            optionsRef: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Option'
            }
        }
    ]
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
export default Service;