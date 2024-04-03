const optionSchema = new mongoose.Schema({
    step: String,
    choices: [String]
});

const Option = mongoose.models.Option || mongoose.model('Option', optionSchema);
export default Option;