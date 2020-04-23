class FriendsList {
  friends = [];

  addFriend(name) {
    this.friends.push(name)
    this.announceFriendship(name);
  }

  announceFriendship(name) {
    // global.console.log(`${name} is a friend now`);
  }

  removeFriend(name) {
    const idx = this.friends.indexOf(name);

    if (idx === -1) {
      throw new Error('no friend');
    }

    this.friends.splice(idx, 1);
  }
}


describe('Friend List', () => {
  let fl: FriendsList;

  beforeEach(() => {
    fl = new FriendsList()
  });

  it('initializes friends list', () => {
    expect(fl.friends.length).toEqual(0)
  })

  // it('add friends to list', () => {
  //   fl.addFriend('Alex');
  //   expect(fl.friends.length).toEqual(1)
  // })

  // it('announces friendship', () => {
  //   fl.announceFriendship = jest.fn()
  //   expect(fl.announceFriendship).not.toBeCalled()

  //   fl.addFriend('Ariel');
  //   expect(fl.announceFriendship).toBeCalled()
  // })

  // describe('remove friend', () => {
  //   it('remove existing friend', () => {
  //     fl.addFriend('fl');
  //     expect(fl.friends[0]).toEqual('fl')
  //     fl.removeFriend('fl');

  //     expect(fl.friends.length).toEqual(0);
  //   })

  //   it('remove unexisting friend', () => {
  //     expect(() => fl.removeFriend('se')).toThrow();
  //   })
  // })
})