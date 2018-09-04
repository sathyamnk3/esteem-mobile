/* eslint-disable no-unused-vars */
import React from "react";
import { StyleSheet, FlatList, View, ActivityIndicator } from "react-native";
import styles from "../../styles/trending.styles";
// STEEM
import { getPosts } from "../../providers/steem/dsteem";

// LIBRARIES
import Placeholder from "rn-placeholder";

// COMPONENTS
import PostCard from "../../components/post-card/postCard";

// SCREENS
import PostPage from "../single-post/post";
/* eslint-enable no-unused-vars */

class TrendingPage extends React.Component {
    constructor(props) {
        super(props);

        this.getTrending = this.getTrending.bind(this);
        this.getMore = this.getMore.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.state = {
            isReady: false,
            posts: [],
            user: [],
            start_author: "",
            start_permlink: "",
            refreshing: false,
            loading: false,
            isLoggedIn: this.props.isLoggedIn,
        };
    }

    componentDidMount() {
        this.getTrending();
    }

    getTrending = () => {
        getPosts("trending", { tag: "", limit: 10 }, this.props.user.name)
            .then(result => {
                this.setState({
                    isReady: true,
                    posts: result,
                    start_author: result[result.length - 1].author,
                    start_permlink: result[result.length - 1].permlink,
                    refreshing: false,
                });
            })
            .catch(err => {
                alert(err);
            });
    };

    getMore = () => {
        this.setState({ loading: true });
        getPosts(
            "trending",
            {
                tag: "",
                limit: 10,
                start_author: this.state.start_author,
                start_permlink: this.state.start_permlink,
            },
            this.props.user.name
        ).then(result => {
            let posts = result;
            posts.shift();
            this.setState({
                posts: [...this.state.posts, ...posts],
                start_author: result[result.length - 1].author,
                start_permlink: result[result.length - 1].permlink,
            });
        });
    };

    refreshData = () => {
        this.setState(
            {
                refreshing: true,
            },
            () => {
                this.getTrending();
            }
        );
    };

    renderFooter = () => {
        if (!this.state.loading) return null;

        return (
            <View style={styles.flatlistFooter}>
                <ActivityIndicator animating size="large" />
            </View>
        );
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.state.isReady ? (
                    <FlatList
                        data={this.state.posts}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <PostCard
                                componentId={this.props.componentId}
                                content={item}
                                user={this.props.user}
                                isLoggedIn={this.state.isLoggedIn}
                            />
                        )}
                        keyExtractor={(post, index) => index.toString()}
                        onEndReached={this.getMore}
                        removeClippedSubviews={true}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.refreshData()}
                        onEndThreshold={0}
                        initialNumToRender={10}
                        ListFooterComponent={this.renderFooter}
                    />
                ) : (
                    <View>
                        <View style={styles.placeholder}>
                            <Placeholder.ImageContent
                                size={60}
                                animate="fade"
                                lineNumber={4}
                                lineSpacing={5}
                                lastLineWidth="30%"
                                onReady={this.state.isReady}
                            />
                        </View>
                        <View style={styles.placeholder}>
                            <Placeholder.ImageContent
                                size={60}
                                animate="fade"
                                lineNumber={4}
                                lineSpacing={5}
                                lastLineWidth="30%"
                                onReady={this.state.isReady}
                            />
                        </View>
                        <View style={styles.placeholder}>
                            <Placeholder.ImageContent
                                size={60}
                                animate="fade"
                                lineNumber={4}
                                lineSpacing={5}
                                lastLineWidth="30%"
                                onReady={this.state.isReady}
                            />
                        </View>
                    </View>
                )}
            </View>
        );
    }
}

export default TrendingPage;
