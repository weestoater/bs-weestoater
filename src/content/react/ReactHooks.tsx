export const ReactHooksPost = () => {
  return (
    <>
      <h2>hook, line &amp; sinker</h2>
      <div className="card-content">
        <p>
          Since moving teams and re-learning Angular I’ve had the chance to work
          recently on a rather nice ReactJS project. It gave me my first real
          exposure to full stack development and I have to say, whilst
          terrified, I felt well chuffed when it was all done – with help of a
          couple of amazing colleagues.
        </p>

        <p>
          The really sweet part was using React Hooks for the first time. Rather
          than wrestling with state and setState it was just a simple useEffect
          and useState which was a revelation. So nice.
        </p>

        <p>
          Never felt entirely comfortable mixing mark-up and functions, that was
          a bit of a hurdle to overcome. Then the whole state and setState
          really grinds my gears too.
        </p>
        <div className="code-sample">
          <p>
            fetch('/api/getNachos')
            <br />
            &nbsp;&nbsp;.then(response =&gt; response.json())
            <br />
            &nbsp;&nbsp;.then(data =&gt; this.setState(&#123;data&#125;));
          </p>
        </div>

        <p>
          Instead it’s a nice simple case of creating a fetch.js service file
          for carrying out the api calls. Then a really clean and simple few
          lines to set up the object for using on the page.
        </p>

        <div className="code-sample">
          <p>
            const [data, setData] = useState(null);
            <br />
            useEffect( () =&gt; &#123;
            <br />
            &nbsp; &nbsp; getData().then(setData);
            <br />
            &#125;, []);
          </p>
        </div>

        <p>
          I personally find this a lot cleaner and nicer to work with. A plus
          side is also the test-ability of it, which matters to me as it’s a key
          part of my employers ethos.
        </p>
      </div>
    </>
  );
};
