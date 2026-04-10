function decideStartMode(session) {
  return session && session.answers ? 'resume' : 'new';
}

module.exports = {
  decideStartMode
};
