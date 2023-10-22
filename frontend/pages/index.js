import React, {Component} from 'react';
import Link from 'next/link';
import Router from 'next/router';
import WPAPI from 'wpapi';
import Layout from '../components/Layout';
import PageWrapper from '../components/PageWrapper';
import Config from '../config';

const wp = new WPAPI({endpoint: Config.apiUrl});

const tokenExpired = () => {
    if (process.browser) {
        localStorage.removeItem(Config.AUTH_TOKEN);
    }
    wp.setHeaders('Authorization', '');
    Router.push('/login');
};

class Index extends Component {
    state = {
        id: '',
    };

    static async getInitialProps() {
        try {
            const [page, posts, pages] = await Promise.all([
                wp
                    .pages()
                    .slug('welcome')
                    .embed()
                    .then(data => {
                        return data[0];
                    }),
                wp.posts().embed(),
                wp.pages().embed(),
            ]);

            return {page, posts, pages};
        } catch (err) {
            if (err.data.status === 403) {
                tokenExpired();
            }
        }

        return null;
    }

    componentDidMount() {
        const token = localStorage.getItem(Config.AUTH_TOKEN);
        if (token) {
            wp.setHeaders('Authorization', `Bearer ${token}`);
            wp.users()
                .me()
                .then(data => {
                    const {id} = data;
                    this.setState({id});
                })
                .catch(err => {
                    if (err.data.status === 403) {
                        tokenExpired();
                    }
                });
        }
    }

    render() {
        const {id} = this.state;
        const {posts, pages, headerMenu, page} = this.props;
        const fposts = posts.map(post => {
            return (
                <ul key={post.slug}>
                    <ol>
                        <Link
                            as={`/post/${post.slug}`}
                            href={`/post?slug=${post.slug}&apiRoute=post`}
                        >
                            <a>{post.title.rendered}</a>
                        </Link>
                    </ol>
                </ul>
            );
        });
        const fpages = pages.map(ipage => {
            if (ipage.slug !== 'welcome') {
                return (
                    <ul key={ipage.slug}>
                        <ol>
                            <Link
                                as={`/page/${ipage.slug}`}
                                href={`/post?slug=${ipage.slug}&apiRoute=page`}
                            >
                                <a>{ipage.title.rendered}</a>
                            </Link>
                        </ol>
                    </ul>
                );
            }
        });

        const layout = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            marginTop: '-10vh'
        }

        const layoutdiv = {
            maxWidth: '60vw',
        }

        return (
            <Layout>
                <div style={layout}>
                    <div style={layoutdiv}>
                        <h1 className='true'>Home Exercise</h1>
                        <h2>The goal of this exercise is to show your design execution capabilities, WordPress understanding,
                            performance tuning and optimisation.</h2>
                        <h3>Congrats ! Your environment is now ready, here are the instructions for the exercise:</h3>
                        <ol>
                            <li>
                                Implement the following design from <a
                                href='https://www.figma.com/file/tdF37b9Kq9ZZTIOA84TjG3/JFrog-developer-test-form?type=design&node-id=0%3A1&mode=design&t=YurmjYx6JV1ZuN8c-1' target={"_blank"}>Figma</a> using React.js and Next.js as client<br/>
                                - The page should be fully responsive <br/>
                                - Implement mobile version. <br/>
                                - Get the best lighthouse score, add the result in the image folder<br/>
                            </li>
                            <li>
                                Write a custom WordPress plugin called "Save Form Plugin" that will create a new table in the
                                database, the name of the table can be configured in the wordpress admin side
                                dedicated for the plugin, rename of the table_name field will delete the old table and
                                create a new one
                            </li>
                            <li>
                                The plugin should have a section that shows all the data that was submitted in the form
                            </li>
                            <li>
                                Form submit will save the information in the database in the matching table
                            </li>
                            <li>
                                Successful Submit will pop a successful message
                            </li>
                            <li>
                                Please commit your code to your personal github repo and provide the link so we can review your work
                            </li>
                        </ol>
                        <div style={{marginTop:  '2rem'}}><b>Important: Do not mention JFrog in your code</b></div>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default PageWrapper(Index);
