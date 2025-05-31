import torch
import torch.nn as nn
import torch.optim as optim
import spacy

# Load SpaCy English model
nlp = spacy.load("en_core_web_sm")

# Sample data
data = [
    ("Alice is brilliant and always delivers her work on time.", "Alice", 1),   # positive
    ("Bob is lazy and never meets deadlines.", "Bob", 0),                      # negative
    ("I think Charlie is okay, not the best but tries.", "Charlie", 0.5),     # neutral
]

# Tokenizer and vectorizer (naive version using SpaCy vectors)
def tokenize_and_vectorize(text):
    doc = nlp(text)
    vectors = [token.vector for token in doc if token.has_vector]
    return torch.tensor(vectors).mean(dim=0)  # average word vectors

# Prepare training data
X = torch.stack([tokenize_and_vectorize(x[0]) for x in data])
y = torch.tensor([x[2] for x in data], dtype=torch.float32).unsqueeze(1)

# Simple sentiment model
class SentimentModel(nn.Module):
    def __init__(self, input_size):
        super().__init__()
        self.linear = nn.Linear(input_size, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        return self.sigmoid(self.linear(x))

model = SentimentModel(input_size=X.shape[1])
criterion = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=0.01)

# Training loop
for epoch in range(100):
    outputs = model(X)
    loss = criterion(outputs, y)

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    if epoch % 10 == 0:
        print(f"Epoch {epoch}, Loss: {loss.item():.4f}")

def evaluate_text(text):
    doc = nlp(text)
    people = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]
    vec = tokenize_and_vectorize(text)
    score = model(vec.unsqueeze(0)).item()

    return people, round(score, 2)

# Test
text = "I really appreciate how David handled the project."
people, score = evaluate_text(text)

print("Person(s):", people)
print("Evaluation Score:", score)
