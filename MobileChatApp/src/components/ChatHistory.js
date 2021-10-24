import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  KeyboardAvoidingView,
  SectionList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import groupBy from "lodash/groupBy"; //run `yarn add loadsh.groupby` if you dont already have it installed
import { format } from "date-fns";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";

export function ChatHistory() {
  const [listMsg, setListMsg] = React.useState([]);
  const [msg, setMsg] = React.useState("");
  const sectionListRef = React.useRef();

  React.useEffect(() => {
    //group our messages bu the time it was created. We dont trust the API to do this grouping for us. So we do it ourselves
    const groupedList = Object.values(
      groupBy(messageList, function (n) {
        return n.createdAt.substr(0, 10); //we take "2021-04-20" out of "2021-04-20 20:50:00"
      })
    );
    //console.log(groupedList[1][0].createdAt); //access on section
    //console.log(format(new Date("2021-04-20T20:50:00"), "PPP"));

    /**
     * We convert the groupList to the format that SectionList understands
     * https://reactnative.dev/docs/sectionlist
     */
    let data = [];
    for (const group of groupedList) {
      //console.log(format(new Date("2021-04-21T00:01:10"), "PPP"));
      let section = {
        /**
         * We are sure to say that the first data in each group is the time groups so we use it :)
         *  https://date-fns.org/v2.25.0/docs/format
         */
        title: format(new Date(group[0].createdAt), "PPP"),
        data: group,
      };
      data.push(section);
    }

    setListMsg(data);
  }, []);

  const renderMsg = (item) => {
    return item.user.id === "a277dd81-8b6a-4cf6-855f-25d1d506b290" ? (
      <View style={[styles.msg, styles.msgFromOther]}>
        <Text style={styles.msgText}>{item.text}</Text>
        <Text style={styles.hour}>{item.createdAt.substr(11, 5)}</Text>
      </View>
    ) : (
      <View style={[styles.msg, styles.msgFromMe]}>
        <Text style={styles.msgText}>{item.text}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            alignSelf: "flex-end",
          }}
        >
          <MaterialCommunityIcons
            name="check-all"
            size={16}
            color={item.status == 2 ? "#007dff" : "#aaa"}
          />
          <Text style={styles.hour}>{item.createdAt.substr(11, 5)}</Text>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={styles.container}
      edges={["left", "right", "bottom", "top"]}
    >
      <View style={styles.header}>
        <Ionicons
          name={Platform.OS === "android" ? "arrow-back" : "chevron-back"}
          size={36}
          color="#007dff"
        />
        <Image
          source={{ uri: "https://i.pravatar.cc/50?img=5" }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.name}>Jane Doe</Text>
          <Text style={styles.status}>last seen 8h ago</Text>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={16 / 2}
      >
        <View style={styles.content}>
          <SectionList
            ref={sectionListRef}
            sections={listMsg}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderMsg(item)}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}>{title}</Text>
              </View>
            )}
            //stickySectionHeadersEnabled
          />
        </View>
        <View style={styles.footer}>
          <TextInput
            style={styles.input}
            value={msg}
            onChangeText={(v) => setMsg(v)}
            onFocus={() => {
              //we want to move the scrollList to the recent chat
              setTimeout(() => {
                sectionListRef.current.scrollToLocation({
                  animated: false,
                  itemIndex: 6, //we scroll to the ast message
                });
              }, 150);

              /**
               * We can explore mre like:
               * - checking to see if the scrollPosition is at the end or not to know
               * if to move the scroll to the end of the list or now when the keyboard is open
               *
               * https://stackoverflow.com/questions/41056761/detect-scrollview-has-reached-the-end
               * https://stackoverflow.com/questions/48236770/react-native-sectionlist-scroll-to-end-when-list-is-loaded-first-time
               * https://stackoverflow.com/questions/36747541/finding-out-scroll-direction-in-react-native-listview-scrollview
               * https://reactnative.dev/docs/sectionlist#scrolltolocation
               * https://stackoverflow.com/questions/48477500/react-native-flatlist-initial-scroll-to-bottom
               * https://stackoverflow.com/questions/67312331/callback-to-scrolltolocation-in-react-native
               *
               * https://github.com/facebook/react-native/issues/18945
               * https://github.com/terrysahaidak/ReactNative-SeactionList-Bug-Example/blob/master/src/SectionListExample.js
               */
            }}
          />
          <TouchableOpacity>
            <Ionicons name="send" size={26} color="#007dff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  avatar: {
    height: 44,
    width: 44,
    borderRadius: 22,
    marginHorizontal: 7,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#444",
    borderBottomWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  name: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  status: {
    color: "#000",
    fontSize: 13,
  },
  content: {
    flex: 1,
    flexGrow: 0.92,
    paddingBottom: 10,
  },
  footer: {
    flex: 1,
    flexGrow: 0.08,
    flexDirection: "row",
    alignItems: "center",
    height: 20,
    //borderTopColor: "#444",
    //borderTopWidth: 1,
    paddingHorizontal: 16,
  },
  input: {
    height: 40,
    borderColor: "#444",
    backgroundColor: "#d8d9d9",
    //borderWidth: 1,
    borderRadius: 40,
    marginHorizontal: 10,
    marginVertical: 7,
    paddingLeft: 12,
    flex: 1,
    fontSize: 14,
  },
  titleContainer: {
    backgroundColor: "#414141",
    alignSelf: "center",
    marginTop: 12,
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 13,
    color: "#fff",
    textAlign: "center",
  },
  msg: {
    padding: 10,
    margin: 10,
    width: "80%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  msgFromMe: {
    backgroundColor: "#056162",
    alignSelf: "flex-end",
    borderBottomLeftRadius: 8,
  },
  msgFromOther: {
    backgroundColor: "#262d31",
    borderBottomRightRadius: 8,
    right: 0,
  },
  msgText: {
    color: "#fff",
    fontSize: 16,
  },
  hour: {
    color: "#aaa",
    textAlign: "right",
  },
});

const messageList = [
  {
    id: "8ff1110f-9370-4404-b7b4-a2b84081fa05",
    createdAt: "2021-04-20T20:50:00",
    text: "Hey bro 😀",
    status: 2, //status 2 means the message is sent
    user: {
      id: "a277dd81-8b6a-4cf6-855f-25d1d506b290",
    },
  },
  {
    id: "9572466f-42bd-45e9-a489-f11062f617b9",
    createdAt: "2021-04-21T00:51:10",
    text: "A little bit 👍",
    status: 1,
    user: {
      id: "501e38b3-bbb0-45f5-9bb2-fffdf863f705",
    },
  },
  {
    id: "08f19891-e79d-46a5-b63a-6519a0a82d7e",
    createdAt: "2021-04-20T20:51:00",
    text: "Wassap!!",
    status: 2,
    user: {
      id: "501e38b3-bbb0-45f5-9bb2-fffdf863f705",
    },
  },
  {
    id: "8b9006c8-63ec-476c-be69-7829863b7612",
    createdAt: "2021-04-20T20:51:10",
    text: "🤪",
    status: 2,
    user: {
      id: "501e38b3-bbb0-45f5-9bb2-fffdf863f705",
    },
  },
  {
    id: "97776ff1-5a59-40e0-b58b-3861e8ac72c5",
    createdAt: "2021-04-20T20:50:00",
    text: "Do you know SectionList?",
    status: 2,
    user: {
      id: "a277dd81-8b6a-4cf6-855f-25d1d506b290",
    },
  },
  {
    id: "409e7ec2-207e-42e3-93c7-2be5d23ef5b3",
    createdAt: "2021-04-21T00:52:00",
    text: "Can you tell me a thing or two about it?",
    status: 2,
    user: {
      id: "a277dd81-8b6a-4cf6-855f-25d1d506b290",
    },
  },
];

//Tutorial Here: https://www.youtube.com/watch?v=-n1mF-IQp_k
