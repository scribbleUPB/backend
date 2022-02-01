const express = require("express");
const mongoose = require("mongoose");
const poll = require("./models/poll");
const app = express();
const Poll = require("./models/poll");
const User = require("./models/user");
const Answer = require("./models/answer");

//Mongo

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/scribble").then(() => {
    console.log("Database Connected");
  });
}

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/api/polls", (req, res) => {
  if (req.body.poll.textOptions != undefined) {
    const poll = new Poll({
      creator: req.body.poll.creator,
      title: req.body.poll.title,
      description: req.body.poll.description,
      textOptions: req.body.poll.textOptions,
      needBe: req.body.poll.needBe,
      numberVote: req.body.poll.numberVote,
      singleVote: req.body.poll.singleVote,
      hidden: req.body.poll.hidden,
      deadline: req.body.poll.deadline,
      invitees: req.body.poll.invitees,
    });

    poll.save().then(
      () => {
        const id = poll._id.toString();
        User.findOneAndUpdate(
          { email: req.body.email },
          { $push: { ownedPolls: id } },
          function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log(success);
            }
          }
        );
        res.status(201).json({
          message: "Poll saved successfully",
        });
      },
      (err) => {
        res.json(err);
      }
    );
  } else {
    console.log(req.body.poll.calendarOptions);
    const poll = new Poll({
      creator: req.body.poll.creator,
      title: req.body.poll.title,
      description: req.body.poll.description,
      calendarOptions: req.body.poll.calendarOptions,
      needBe: req.body.poll.needBe,
      numberVote: req.body.poll.numberVote,
      singleVote: req.body.poll.singleVote,
      hidden: req.body.poll.hidden,
      deadline: req.body.poll.deadline,
      invitees: req.body.poll.invitees,
    });

    poll.save().then(
      () => {
        const id = poll._id.toString();
        User.findOneAndUpdate(
          { email: req.body.email },
          { $push: { ownedPolls: id } },
          function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log(success);
            }
          }
        );

        res.status(201).json({
          message: "Poll saved successfully",
        });
      },
      (err) => {
        res.json(err);
      }
    );
  }
});

app.post("/api/answers", (req, res) => {
  const answer = new Answer({
    pollId: req.body.pollId,
    responses: req.body.responses,
  });
  answer.save().catch((err) => {
    console.log(err);
  });
});

app.get("/api/answers/:id", async (req, res) => {
  let pollId = req.params.id;
  Answer.find({ pollId: pollId })
    .populate("responses.user")
    .then((data) => {
      res.status(200).json(data[0]);
    });
});

app.put("/api/answers/:id", async (req, res) => {
  let pollId = req.params.id;
  const update = { responses: req.body };
  console.log(update);
  Answer.findOneAndUpdate({ pollId: pollId }, update)
    .then((data) => {
      res.status(200).json(update);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/api/poll/:id", (req, res) => {
  let pollId = req.params.id;
  Poll.findById(pollId, (err, data) => {
    if (err) console.log(err);
    console.log(data);
    return res.status(200).json(data);
  });
});

app.post("/api/user", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .populate("ownedPolls")
    .populate("invitedPolls")
    .then((user) => {
      if (!user) {
        const u = new User({
          name: req.body.name,
          email: req.body.email,
        });
        u.save();
        return res.status(200).json({
          message: "user fetched succesfully",
          user: u,
        });
      } else {
        fetchedUser = user;
        return res.status(200).json({
          message: "user fetched succesfully",
          user: fetchedUser,
        });
      }
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Auth failed",
      });
    });
});

app.get("/api/poll/:id", (req, res) => {
  let pollId = req.params.id;
  console.log(pollId);
  Poll.findById(pollId, (err, data) => {
    if (err) console.log(err);
    console.log(data);
    return res.status(200).json(data);
  });
});

app.delete("/api/poll-delete/:id", (req, res) => {
  let pollId = req.params.id;
  console.log(pollId);
  Poll.findByIdAndRemove(pollId, (error, deletedPoll) => {
    if (!error) {
      console.log(deletedPoll);
    }
  });
});

//Server
app.listen(3000, () => {
  console.log("Server is runnin on port 7920");
});
